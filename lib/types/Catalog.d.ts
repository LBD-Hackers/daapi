import AccessService from "./helpers/access-service";
import DataService from "./helpers/data-service";
import { Session as BrowserSession } from "@inrupt/solid-client-authn-browser";
import { Session as NodeSession } from "@inrupt/solid-client-authn-node";
import { metadata, TokenSession } from './helpers/interfaces';
export default class Catalog {
    fetch: any;
    accessService: AccessService;
    dataService: DataService;
    projectId: string;
    url: string;
    data: object[];
    session: BrowserSession | NodeSession | TokenSession;
    queryEngine: any;
    constructor(session: BrowserSession | NodeSession | TokenSession, url: string);
    /**
     *
     * @returns boolean: this catalog exists or not
     */
    checkExistence(): Promise<boolean>;
    /**
     * @description create this dataset within the active project
     * @param makePublic initial access rights for the dataset (boolean)
     */
    create(makePublic: any, triples?: metadata[]): Promise<void>;
    addMetadata(triples: metadata[]): Promise<void>;
    getContainment(as?: string, recursive?: boolean): Promise<unknown>;
    getLocalSparqlEndpoint(): Promise<string>;
    aggregateSparqlEndpoints(): Promise<any[]>;
    aggregate(): Promise<string[]>;
    private getContainerStructure;
    addDataset(datasetUrl?: string): Promise<string>;
    deleteDataset(datasetUrl: any): Promise<void>;
    addDistribution(distributionUrl?: string, triples?: metadata[]): Promise<string>;
    deleteDistribution(distributionUrl: any): Promise<void>;
    /**
     * @description delete this catalog
     * @returns void
     */
    delete(): Promise<void>;
    /**
     * @description Update the dataset with SPARQL (dangerous - watch out!)
     * @param query The SPARQL query with which to update the dataset
     */
    update(query: any): Promise<void>;
}
//# sourceMappingURL=Catalog.d.ts.map