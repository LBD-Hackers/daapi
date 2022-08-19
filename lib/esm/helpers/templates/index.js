"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceTemplate = serviceTemplate;

var _vocabCommonRdf = require("@inrupt/vocab-common-rdf");

var _uuid = require("uuid");

function serviceTemplate(projectUrl, datasetUrl, endpointUrl, root) {
  const serviceId = (0, _uuid.v4)();
  return `INSERT DATA {
        <${projectUrl}> <${_vocabCommonRdf.DCAT.dataset}> <${datasetUrl}> .
        <${root}#${serviceId}> <${_vocabCommonRdf.RDF.type}> <${_vocabCommonRdf.DCAT.DataService}> ;
        <${_vocabCommonRdf.DCTERMS.conformsTo}> <https://www.w3.org/TR/sparql11-query/> ;
        <${_vocabCommonRdf.DCAT.endpointURL}> <${endpointUrl}> ;
        <${_vocabCommonRdf.DCAT.servesDataset}> <${datasetUrl}> .
    }`;
}
//# sourceMappingURL=index.js.map