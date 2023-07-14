export interface TokenSession {
  fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>,
  info: info
}

interface info {
  webId: string,
  isLoggedIn: boolean
}

export interface metadata {
subject?: string
predicate: string,
object: string
}

export interface extern {
named: string,
sparql: string
}