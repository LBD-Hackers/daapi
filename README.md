# Dataset Aggregation API (daapi)
The Dataset Aggregation API (DAAPI) for the ConSolid Ecosystem is the first interaction layer to work with a discovery-focused Solid server (i.e. the Server exposes a SPARQL endpoint). Its development is part of the [ConSolid Project](https://content.iospress.com/articles/semantic-web/sw233396). The DAAPI can be used by both front-end interfaces and back-end applications. Note that DAAPI just provides an abstraction layer to interact with ConSolid multi-models. It is required to use it. In some occasions, direct interaction with a ConSolid project will be more efficient (e.g. through SPARQL or LDP). A front-end that wishes to interact with a ConSolid project can also use the [ConSolid CDE satellite](https://github.com/ConSolidProject/cde-satellite) as an alternative.  

# Catalog API Documentation

## Class: Catalog

### Constructor

- `constructor(session, url)`
  - **Parameters:**
    - `session` (BrowserSession | NodeSession | TokenSession): The session object, conforms to {fetch, info: {isLoggedIn: boolean, webId: string}}.
    - `url` (string): The URL of the catalog.
  - **Description:** Creates an instance of the Catalog class.

### Methods

#### checkExistence

- `async checkExistence()`
  - **Returns:** `boolean` - True if the catalog exists, false otherwise.

#### create

- `async create(makePublic, triples = [], type)`
  - **Parameters:**
    - `makePublic` (boolean): Initial access rights for the dataset.
    - `triples` (metadata[]): Metadata triples for the dataset. Conforms to [{object: string, predicate: string}]. The subject is the dataset URL.
    - `type` (string): The type of the resource, either "Catalog" (dcat:Catalog) or "Dataset" (dcat:Dataset).
  - **Returns:** `Promise<void>`

#### addMetadata

- `async addMetadata(triples)`
  - **Parameters:**
    - `triples` (metadata[]): Metadata triples to be added. Conforms to [{object: string, predicate: string}]. The subject is the dataset URL.
  - **Returns:** `Promise<void>`

#### addDataset

- `async addDataset(datasetUrl = getRoot(this.url) + v4())`
  - **Parameters:**
    - `datasetUrl` (string): URL of the dataset to be added to the Catalog. The dataset itself needs to be created separately.
  - **Returns:** `Promise<string>` - The URL of the added dataset.

#### deleteDataset

- `async deleteDataset(datasetUrl)`
  - **Parameters:**
    - `datasetUrl` (string): URL of the dataset to be deleted from the Catalog
  - **Returns:** `Promise<void>`

#### addDistribution

- `async addDistribution(distributionUrl = getRoot(this.url) + v4(), triples = [])`
  - **Parameters:**
    - `distributionUrl` (string): URL of the distribution to be added to the Dataset.
    - `triples` (metadata[]): Metadata triples for the distribution. Conforms to [{object: string, predicate: string}]. The subject is the dataset URL.
  - **Returns:** `Promise<string>` - The URL of the added distribution.

#### deleteDistribution

- `async deleteDistribution(distributionUrl)`
  - **Parameters:**
    - `distributionUrl` (string): URL of the distribution to be deleted.
  - **Returns:** `Promise<void>`

#### delete

- `async delete()`
  - **Description:** Deletes the Catalog. Does NOT delete the contained Datasets, as these may be part of another Catalog as well.
  - **Returns:** `Promise<void>`

#### update

- `async update(query)`
  - **Parameters:**
    - `query` (string): The SPARQL query for updating the dataset.
  - **Returns:** `Promise<void>`

### Properties

- `fetch`: Fetch function from the session.
- `accessService`: Instance of AccessService.
- `dataService`: Instance of DataService.
- `projectId`: Project ID string.
- `url`: URL of the catalog.
- `data`: Array of data objects.
- `session`: Session object (BrowserSession, NodeSession, or TokenSession).
- `queryEngine`: Query engine instance.

