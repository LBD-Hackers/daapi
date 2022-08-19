import { DCAT, DCTERMS, RDF } from "@inrupt/vocab-common-rdf"
import {v4} from 'uuid'

function serviceTemplate(projectUrl, datasetUrl, endpointUrl, root) {
    const serviceId = v4()
    return `INSERT DATA {
        <${projectUrl}> <${DCAT.dataset}> <${datasetUrl}> .
        <${root}#${serviceId}> <${RDF.type}> <${DCAT.DataService}> ;
        <${DCTERMS.conformsTo}> <https://www.w3.org/TR/sparql11-query/> ;
        <${DCAT.endpointURL}> <${endpointUrl}> ;
        <${DCAT.servesDataset}> <${datasetUrl}> .
    }`
}

export {
    serviceTemplate
}