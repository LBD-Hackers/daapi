import AccessService from "./helpers/access-service";
import DataService from "./helpers/data-service";
import { QueryEngine } from '@comunica/query-sparql'
import { ACL, DCAT, DCTERMS, FOAF, RDFS, LDP } from "@inrupt/vocab-common-rdf";
import { Session as BrowserSession } from "@inrupt/solid-client-authn-browser";
import { Session as NodeSession } from "@inrupt/solid-client-authn-node";
import rdfSerializer from 'rdf-serialize';
import {streamToString} from "./helpers/functions"
import { metadata, TokenSession } from './helpers/interfaces'
import { getSatelliteFromLdpResource } from "./helpers/functions";
import { getRoot } from "./helpers/functions";
import {v4} from "uuid"

export default class Catalog {
  public fetch;
  public accessService: AccessService;
  public dataService: DataService;
  public projectId: string;
  public url: string;
  public data: object[];
  public session: BrowserSession | NodeSession | TokenSession
  public queryEngine: any

  constructor(session: BrowserSession | NodeSession | TokenSession, url: string) {
    this.session = session
    this.fetch = session.fetch;
    this.url = url
    this.accessService = new AccessService(session.fetch);
    this.dataService = new DataService(session.fetch);
    this.queryEngine = new QueryEngine()
  }

  /**
   * 
   * @returns boolean: this catalog exists or not
   */
  public async checkExistence() {
    const status = await this.fetch(this.url, { method: "HEAD" }).then(result => result.status)
    if (status === 200) {
      return true
    } else {
      return false
    }
  }

  /**
   * @description create this dataset within the active project
   * @param makePublic initial access rights for the dataset (boolean)
   */
  public async create(makePublic, triples: metadata[] = [], type?: string): Promise<void> {
    if (type !== "Catalog" && type !== "Dataset") {
      throw new Error('type must be either "Catalog" or "Dataset"')
    }
    let data = `
      <> a <${DCAT[type]}> .
    `

    for (const triple of triples) {
      let o
      if (triple.object.startsWith("http")) {
        o = `<${triple.object}>`
      } else {
        o = `"${triple.object}"`
      }
      data += `<> <${triple.predicate}> ${o} .`
    }
    await this.dataService.writeFileToPod(Buffer.from(data), this.url, makePublic, "text/turtle")
  }

  public async addMetadata(triples: metadata[]) {
    let query = `INSERT DATA { `

    for (const triple of triples) {
      let o
      if (triple.object.startsWith("http")) {
        o = `<${triple.object}>`
      } else {
        o = `"${triple.object}"`
      }
      query += `<${triple.subject || this.url}> <${triple.predicate}> ${o} .`
    }

    query += `}`
    await this.update(query)
  }

  public async getContainment(as: string = "DCAT", recursive: boolean = false) {
    return new Promise(async (resolve, reject) => {
      let data
      try {
        switch (as) {
          case "LDP":
            data = await this.getContainerStructure(LDP.contains, recursive)
            break;
          default:
            data = await this.getContainerStructure(DCAT.dataset, recursive)
        }
        resolve(data)
      } catch (error) {
        reject(error)
      }

    })
  }

  public async getLocalSparqlEndpoint(): Promise<string> {
    return await getSatelliteFromLdpResource(this.url, this.queryEngine)
  }

  public async aggregateSparqlEndpoints(): Promise<any[]> {
    const satellite = await getSatelliteFromLdpResource(this.url, this.queryEngine)
    const query = `PREFIX dcat: <http://www.w3.org/ns/dcat#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?ds WHERE {
      <${this.url}> dcat:dataset ?ds .
    }`
    
    const sources: any = [satellite]
    const data = await this.queryEngine.queryBindings(query, {sources, session: this.session})
    const bindings = await data.toArray().then(i => i.map(v => v.get('ds').value))
    const satellites = new Set()

    for (const ds of bindings) {
      const sat = await getSatelliteFromLdpResource(ds, this.queryEngine)
      if (sat !== satellite) satellites.add({satellite: sat, alias: ds})
    }
    satellites.add({satellite, alias: this.url})
    return Array.from(satellites)
  }

  public async aggregate(): Promise<string[]> {
    const satellite = await getSatelliteFromLdpResource(this.url, this.queryEngine)
    const query = `PREFIX dcat: <http://www.w3.org/ns/dcat#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?ds WHERE {
      ?sub dcat:dataset+ ?ds .
    }`
    const all:any = new Set()
    
    const sources: any = await this.aggregateSparqlEndpoints()
    const data = await this.queryEngine.queryBindings(query, {sources, session: this.session})
    const bindings = await data.toArray().then(i => i.map(v => v.get('ds').value))
    const satellites = new Set()

    for (const ds of bindings) {
      const sat = await getSatelliteFromLdpResource(ds, this.queryEngine)
      all.add(ds)
      satellites.add(sat)
    }
    
    const s = Array.from(satellites)
    const d = await this.queryEngine.queryBindings(query, {sources: s, session: this.session})
    const localDatasets = await d.toArray().then(i => i.map(v => v.get('ds').value))
    localDatasets.forEach(ds => all.add(ds))

    return Array.from(all)
  }

  private async getContainerStructure(predicate: string = DCAT.dataset, recursive: boolean = false) {
    let engine
    if (recursive) {
      engine = this.queryEngine
    } else {
      engine = this.queryEngine
    }

    let queryStart
    switch (predicate) {
      case LDP.contains:
        queryStart = `CONSTRUCT {
          ?parent <${LDP.contains}> ?child , ?url
        }`
        break;
      default:
        queryStart = `CONSTRUCT {
          ?parent <${DCAT.dataset}> ?child .
          ?parent <${DCAT.distribution}> ?dist .
          ?dist <${DCAT.accessURL}> ?url
        }`
    }

    const query = queryStart + `
    WHERE {
      {
        ?parent <${DCAT.dataset}> ?child .
      } UNION {
        ?parent <${DCAT.distribution}> ?dist .
        ?dist <${DCAT.accessURL}> ?url .
      }
    }`

    const quadStream = await engine.queryQuads(query, {
      sources: [this.url],
      fetch: this.fetch,
      lenient: true
    });

    const textStream = rdfSerializer.serialize(quadStream, { contentType: 'text/turtle' });
    const asTtl = await streamToString(textStream)
    return asTtl
  }

  public async addDataset(datasetUrl = getRoot(this.url) + v4() ) {
    let query = `INSERT DATA {<${this.url}> <${DCAT.dataset}> <${datasetUrl}> .}`
    await this.update(query)
    return datasetUrl
  }

  public async deleteDataset(datasetUrl) {
    const query = `DELETE DATA {<${this.url}> <${DCAT.dataset}> <${datasetUrl}> .}`
    await this.update(query)
    await this.dataService.deleteFile(datasetUrl)
  }

  public async addDistribution(distributionUrl = getRoot(this.url) + v4(), triples: metadata[] = []) {
    let query = `INSERT DATA {
      <${this.url}> <${DCAT.distribution}> <${distributionUrl}> .
      <${distributionUrl}> <${DCAT.accessURL}> <${distributionUrl}> .`

    for (const triple of triples) {
      let o
      if (triple.object.startsWith("http")) {
        o = `<${triple.object}>`
      } else {
        o = `"${triple.object}"`
      }
      query += `<${distributionUrl}> <${triple.predicate}> ${o} .`
    }

    query += `}`

    await this.update(query)
    return distributionUrl
  }

  public async deleteDistribution(distributionUrl) {
    const query = `DELETE DATA {
      <${this.url}> <${DCAT.distribution}> <${distributionUrl}> .
      <${distributionUrl}> <${DCAT.accessURL}> <${distributionUrl}> .
  }`
    await this.update(query)
    await this.dataService.deleteFile(distributionUrl)
  }

  /**
   * @description delete this catalog
   * @returns void
   */
  public async delete() {
    await this.dataService.deleteFile(this.url)
    return
  }

  /**
   * @description Update the dataset with SPARQL (dangerous - watch out!)
   * @param query The SPARQL query with which to update the dataset
   */
  public async update(query) {
    await this.dataService.sparqlUpdate(this.url, query)
  }
}

