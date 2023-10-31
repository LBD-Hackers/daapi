"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _accessService = _interopRequireDefault(require("./helpers/access-service"));

var _dataService = _interopRequireDefault(require("./helpers/data-service"));

var _querySparql = require("@comunica/query-sparql");

var _vocabCommonRdf = require("@inrupt/vocab-common-rdf");

var _rdfSerialize = _interopRequireDefault(require("rdf-serialize"));

var _functions = require("./helpers/functions");

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Catalog {
  constructor(session, url) {
    this.session = session;
    this.fetch = session.fetch;
    this.url = url;
    this.accessService = new _accessService.default(session.fetch);
    this.dataService = new _dataService.default(session.fetch);
    this.queryEngine = new _querySparql.QueryEngine();
  }
  /**
   * 
   * @returns boolean: this catalog exists or not
   */


  async checkExistence() {
    const status = await this.fetch(this.url, {
      method: "HEAD"
    }).then(result => result.status);

    if (status === 200) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * @description create this dataset within the active project
   * @param makePublic initial access rights for the dataset (boolean)
   */


  async create(makePublic, triples = []) {
    let data = `
      <> a <${_vocabCommonRdf.DCAT.Catalog}>, <${_vocabCommonRdf.DCAT.Dataset}> .
    `;

    for (const triple of triples) {
      let o;

      if (triple.object.startsWith("http")) {
        o = `<${triple.object}>`;
      } else {
        o = `"${triple.object}"`;
      }

      data += `<> <${triple.predicate}> ${o} .`;
    }

    await this.dataService.writeFileToPod(Buffer.from(data), this.url, makePublic, "text/turtle");
  }

  async addMetadata(triples) {
    let query = `INSERT DATA { `;

    for (const triple of triples) {
      let o;

      if (triple.object.startsWith("http")) {
        o = `<${triple.object}>`;
      } else {
        o = `"${triple.object}"`;
      }

      query += `<${triple.subject || this.url}> <${triple.predicate}> ${o} .`;
    }

    query += `}`;
    await this.update(query);
  }

  async getContainment(as = "DCAT", recursive = false) {
    return new Promise(async (resolve, reject) => {
      let data;

      try {
        switch (as) {
          case "LDP":
            data = await this.getContainerStructure(_vocabCommonRdf.LDP.contains, recursive);
            break;

          default:
            data = await this.getContainerStructure(_vocabCommonRdf.DCAT.dataset, recursive);
        }

        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getLocalSparqlEndpoint() {
    return await (0, _functions.getSatelliteFromLdpResource)(this.url, this.queryEngine);
  }

  async aggregateSparqlEndpoints() {
    const satellite = await (0, _functions.getSatelliteFromLdpResource)(this.url, this.queryEngine);
    const query = `PREFIX dcat: <http://www.w3.org/ns/dcat#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?ds WHERE {
      <${this.url}> dcat:dataset ?ds .
    }`;
    const sources = [satellite];
    const data = await this.queryEngine.queryBindings(query, {
      sources,
      session: this.session
    });
    const bindings = await data.toArray().then(i => i.map(v => v.get('ds').value));
    const satellites = new Set();

    for (const ds of bindings) {
      const sat = await (0, _functions.getSatelliteFromLdpResource)(ds, this.queryEngine);
      if (sat !== satellite) satellites.add({
        satellite: sat,
        alias: ds
      });
    }

    satellites.add({
      satellite,
      alias: this.url
    });
    return Array.from(satellites);
  }

  async aggregate() {
    const satellite = await (0, _functions.getSatelliteFromLdpResource)(this.url, this.queryEngine);
    const query = `PREFIX dcat: <http://www.w3.org/ns/dcat#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?ds WHERE {
      ?sub dcat:dataset+ ?ds .
    }`;
    const all = new Set();
    const sources = await this.aggregateSparqlEndpoints();
    const data = await this.queryEngine.queryBindings(query, {
      sources,
      session: this.session
    });
    const bindings = await data.toArray().then(i => i.map(v => v.get('ds').value));
    const satellites = new Set();

    for (const ds of bindings) {
      const sat = await (0, _functions.getSatelliteFromLdpResource)(ds, this.queryEngine);
      all.add(ds);
      satellites.add(sat);
    }

    const s = Array.from(satellites);
    const d = await this.queryEngine.queryBindings(query, {
      sources: s,
      session: this.session
    });
    const localDatasets = await d.toArray().then(i => i.map(v => v.get('ds').value));
    localDatasets.forEach(ds => all.add(ds));
    return Array.from(all);
  }

  async getContainerStructure(predicate = _vocabCommonRdf.DCAT.dataset, recursive = false) {
    let engine;

    if (recursive) {
      engine = this.queryEngine;
    } else {
      engine = this.queryEngine;
    }

    let queryStart;

    switch (predicate) {
      case _vocabCommonRdf.LDP.contains:
        queryStart = `CONSTRUCT {
          ?parent <${_vocabCommonRdf.LDP.contains}> ?child , ?url
        }`;
        break;

      default:
        queryStart = `CONSTRUCT {
          ?parent <${_vocabCommonRdf.DCAT.dataset}> ?child .
          ?parent <${_vocabCommonRdf.DCAT.distribution}> ?dist .
          ?dist <${_vocabCommonRdf.DCAT.accessURL}> ?url
        }`;
    }

    const query = queryStart + `
    WHERE {
      {
        ?parent <${_vocabCommonRdf.DCAT.dataset}> ?child .
      } UNION {
        ?parent <${_vocabCommonRdf.DCAT.distribution}> ?dist .
        ?dist <${_vocabCommonRdf.DCAT.accessURL}> ?url .
      }
    }`;
    const quadStream = await engine.queryQuads(query, {
      sources: [this.url],
      fetch: this.fetch,
      lenient: true
    });

    const textStream = _rdfSerialize.default.serialize(quadStream, {
      contentType: 'text/turtle'
    });

    const asTtl = await (0, _functions.streamToString)(textStream);
    return asTtl;
  }

  async addDataset(datasetUrl = (0, _functions.getRoot)(this.url) + (0, _uuid.v4)()) {
    let query = `INSERT DATA {<${this.url}> <${_vocabCommonRdf.DCAT.dataset}> <${datasetUrl}> .}`;
    await this.update(query);
    return datasetUrl;
  }

  async deleteDataset(datasetUrl) {
    const query = `DELETE DATA {<${this.url}> <${_vocabCommonRdf.DCAT.dataset}> <${datasetUrl}> .}`;
    await this.update(query);
    await this.dataService.deleteFile(datasetUrl);
  }

  async addDistribution(distributionUrl = (0, _functions.getRoot)(this.url) + (0, _uuid.v4)(), triples = []) {
    let query = `INSERT DATA {
      <${this.url}> <${_vocabCommonRdf.DCAT.distribution}> <${distributionUrl}> .
      <${distributionUrl}> <${_vocabCommonRdf.DCAT.accessURL}> <${distributionUrl}> .`;

    for (const triple of triples) {
      let o;

      if (triple.object.startsWith("http")) {
        o = `<${triple.object}>`;
      } else {
        o = `"${triple.object}"`;
      }

      query += `<${distributionUrl}> <${triple.predicate}> ${o} .`;
    }

    query += `}`;
    await this.update(query);
    return distributionUrl;
  }

  async deleteDistribution(distributionUrl) {
    const query = `DELETE DATA {
      <${this.url}> <${_vocabCommonRdf.DCAT.distribution}> <${distributionUrl}> .
      <${distributionUrl}> <${_vocabCommonRdf.DCAT.accessURL}> <${distributionUrl}> .
  }`;
    await this.update(query);
    await this.dataService.deleteFile(distributionUrl);
  }
  /**
   * @description delete this catalog
   * @returns void
   */


  async delete() {
    await this.dataService.deleteFile(this.url);
    return;
  }
  /**
   * @description Update the dataset with SPARQL (dangerous - watch out!)
   * @param query The SPARQL query with which to update the dataset
   */


  async update(query) {
    await this.dataService.sparqlUpdate(this.url, query);
  }

}

exports.default = Catalog;
//# sourceMappingURL=Catalog.js.map