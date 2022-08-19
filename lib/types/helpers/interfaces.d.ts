import Fetch from 'cross-fetch';
export interface TokenSession {
    fetch: typeof Fetch;
    info: info;
}
interface info {
    webId: string;
    isLoggedIn: boolean;
}
export interface metadata {
    subject?: string;
    predicate: string;
    object: string;
}
export interface extern {
    named: string;
    sparql: string;
}
export {};
//# sourceMappingURL=interfaces.d.ts.map