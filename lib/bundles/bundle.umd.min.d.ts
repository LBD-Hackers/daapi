/// <reference types="node" />
import * as _inrupt_solid_client from '@inrupt/solid-client';
import * as _inrupt_solid_client_dist_interfaces from '@inrupt/solid-client/dist/interfaces';
import { Session } from '@inrupt/solid-client-authn-browser';
import { Session as Session$1 } from '@inrupt/solid-client-authn-node';
import { QueryEngine } from '@comunica/query-sparql';

declare class AccessRights {
    read: boolean;
    append: boolean;
    write: boolean;
    control: boolean;
}
declare enum ResourceType {
    FILE = "file",
    DATASET = "dataset",
    CONTAINER = "container"
}

declare class AccessService {
    fetch: any;
    verbose: boolean;
    constructor(fetch: any, verbose?: boolean);
    makePublic(resourceURL: string): Promise<Readonly<{
        type: "Dataset";
        graphs: Readonly<Record<string, Readonly<Record<string, Readonly<{
            type: "Subject";
            url: string;
            predicates: Readonly<Record<string, Readonly<Partial<{
                literals: Readonly<Record<string, readonly string[]>>;
                langStrings: Readonly<Record<string, readonly string[]>>;
                namedNodes: readonly string[];
                blankNodes: readonly (`_:${string}` | Readonly<Record<string, Readonly<Partial<any>>>>)[];
            }>>>>;
        }>>>> & {
            default: Readonly<Record<string, Readonly<{
                type: "Subject";
                url: string;
                predicates: Readonly<Record<string, Readonly<Partial<{
                    literals: Readonly<Record<string, readonly string[]>>;
                    langStrings: Readonly<Record<string, readonly string[]>>;
                    namedNodes: readonly string[];
                    blankNodes: readonly (`_:${string}` | Readonly<Record<string, Readonly<Partial<any>>>>)[];
                }>>>>;
            }>>>;
        }>;
    }> & _inrupt_solid_client.WithResourceInfo & {
        internal_accessTo: string;
    }>;
    makeFilePublic(resourceURL: string): Promise<Readonly<{
        type: "Dataset";
        graphs: Readonly<Record<string, Readonly<Record<string, Readonly<{
            type: "Subject";
            url: string;
            predicates: Readonly<Record<string, Readonly<Partial<{
                literals: Readonly<Record<string, readonly string[]>>;
                langStrings: Readonly<Record<string, readonly string[]>>;
                namedNodes: readonly string[];
                blankNodes: readonly (`_:${string}` | Readonly<Record<string, Readonly<Partial<any>>>>)[];
            }>>>>;
        }>>>> & {
            default: Readonly<Record<string, Readonly<{
                type: "Subject";
                url: string;
                predicates: Readonly<Record<string, Readonly<Partial<{
                    literals: Readonly<Record<string, readonly string[]>>;
                    langStrings: Readonly<Record<string, readonly string[]>>;
                    namedNodes: readonly string[];
                    blankNodes: readonly (`_:${string}` | Readonly<Record<string, Readonly<Partial<any>>>>)[];
                }>>>>;
            }>>>;
        }>;
    }> & _inrupt_solid_client.WithResourceInfo & {
        internal_accessTo: string;
    }>;
    setResourceAccess(resourceURL: string, accessRights: AccessRights, type: ResourceType, userWebID?: string): Promise<Readonly<{
        type: "Dataset";
        graphs: Readonly<Record<string, Readonly<Record<string, Readonly<{
            type: "Subject";
            url: string;
            predicates: Readonly<Record<string, Readonly<Partial<{
                literals: Readonly<Record<string, readonly string[]>>;
                langStrings: Readonly<Record<string, readonly string[]>>;
                namedNodes: readonly string[];
                blankNodes: readonly (`_:${string}` | Readonly<Record<string, Readonly<Partial<any>>>>)[];
            }>>>>;
        }>>>> & {
            default: Readonly<Record<string, Readonly<{
                type: "Subject";
                url: string;
                predicates: Readonly<Record<string, Readonly<Partial<{
                    literals: Readonly<Record<string, readonly string[]>>;
                    langStrings: Readonly<Record<string, readonly string[]>>;
                    namedNodes: readonly string[];
                    blankNodes: readonly (`_:${string}` | Readonly<Record<string, Readonly<Partial<any>>>>)[];
                }>>>>;
            }>>>;
        }>;
    }> & _inrupt_solid_client.WithResourceInfo & {
        internal_accessTo: string;
    }>;
    private getResourceAcl;
    private logAccessInfo;
}

declare class DataService {
    fetch: any;
    verbose: boolean;
    accessService: AccessService;
    constructor(fetch: any, verbose?: boolean);
    /**
     * FILES
     */
    writeFileToPod(file: File | Buffer, targetFileURL: string, makePublic: boolean, contentType: string): Promise<void>;
    getFile(fileURL: string): Promise<Blob & _inrupt_solid_client.WithResourceInfo & {
        internal_resourceInfo: {
            aclUrl?: string;
            contentLocation?: string;
            linkedResources: _inrupt_solid_client_dist_interfaces.LinkedResourceUrlAll;
            location?: string;
            permissions?: {
                user: _inrupt_solid_client.Access;
                public: _inrupt_solid_client.Access;
            };
        };
    }>;
    deleteFile(fileURL: string): Promise<void>;
    /**
     * SPARQL
     */
    sparqlUpdate(fileUrl: string, query: string): Promise<any>;
    /**
     * CONTAINERS
     */
    deleteContainer(containerURL: string, includeSubContainers?: boolean): Promise<void>;
    createContainer(containerURL: string, makePublic?: boolean): Promise<Readonly<{
        type: "Dataset";
        graphs: Readonly<Record<string, Readonly<Record<string, Readonly<{
            type: "Subject";
            url: string;
            predicates: Readonly<Record<string, Readonly<Partial<{
                literals: Readonly<Record<string, readonly string[]>>;
                langStrings: Readonly<Record<string, readonly string[]>>;
                namedNodes: readonly string[];
                blankNodes: readonly (`_:${string}` | Readonly<Record<string, Readonly<Partial<any>>>>)[];
            }>>>>;
        }>>>> & {
            default: Readonly<Record<string, Readonly<{
                type: "Subject";
                url: string;
                predicates: Readonly<Record<string, Readonly<Partial<{
                    literals: Readonly<Record<string, readonly string[]>>;
                    langStrings: Readonly<Record<string, readonly string[]>>;
                    namedNodes: readonly string[];
                    blankNodes: readonly (`_:${string}` | Readonly<Record<string, Readonly<Partial<any>>>>)[];
                }>>>>;
            }>>>;
        }>;
    }> & _inrupt_solid_client.WithResourceInfo & {
        internal_resourceInfo: {
            aclUrl?: string;
            contentLocation?: string;
            linkedResources: _inrupt_solid_client_dist_interfaces.LinkedResourceUrlAll;
            location?: string;
            permissions?: {
                user: _inrupt_solid_client.Access;
                public: _inrupt_solid_client.Access;
            };
        };
    }>;
}

interface TokenSession {
    fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
    info: info;
}
interface info {
    webId: string;
    isLoggedIn: boolean;
}
interface metadata {
    subject?: string;
    predicate: string;
    object: string;
}

declare class Catalog {
    fetch: any;
    accessService: AccessService;
    dataService: DataService;
    projectId: string;
    url: string;
    data: object[];
    session: Session | Session$1 | TokenSession;
    queryEngine: any;
    constructor(session: Session | Session$1 | TokenSession, url: string);
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

declare function generateSession(options: any, webId: string): Promise<TokenSession>;
declare function getRoot(resource: any): any;
declare function getSatelliteFromLdpResource(resource: string, engine?: QueryEngine): Promise<string>;

declare function _NS(localName: string): string;
declare const CONSOLID: {
    PREFIX: string;
    NAMESPACE: string;
    PREFIX_AND_NAMESPACE: {
        consolid: string;
    };
    NS: typeof _NS;
    Aggregator: string;
    Project: string;
    Concept: string;
    StringBasedIdentifier: string;
    URIBasedIdentifier: string;
    ReferenceRegistry: string;
    hasReference: string;
    inDataset: string;
    inDocument: string;
    hasIdentifier: string;
    value: string;
    aggregates: string;
    hasProjectRegistry: string;
    hasDatasetRegistry: string;
    hasReferenceRegistry: string;
    hasServiceRegistry: string;
    hasSatellite: string;
    ProjectInvite: string;
};
//# sourceMappingURL=consolid.d.ts.map

export { AccessService, CONSOLID, Catalog, DataService, generateSession, getRoot, getSatelliteFromLdpResource };
