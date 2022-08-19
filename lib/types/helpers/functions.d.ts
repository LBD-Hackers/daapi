import { TokenSession } from './interfaces';
import { QueryEngine } from '@comunica/query-sparql';
export declare function generateSession(options: any, webId: string): Promise<TokenSession>;
export declare function getRoot(resource: any): any;
export declare function getSatelliteFromLdpResource(resource: string, engine?: QueryEngine): Promise<string>;
declare function extract(jsonld: object[], uri: string): any;
declare function streamToString(stream: any): Promise<string>;
declare function query(q: any, options: any): Promise<any>;
export { extract, streamToString, query };
//# sourceMappingURL=functions.d.ts.map