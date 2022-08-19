import { Catalog } from "../src";
import {
  getPublicAccess,
  getSolidDatasetWithAcl,
  getAgentAccess,
} from "@inrupt/solid-client";
import {v4} from 'uuid'
import * as path from "path";
import fs from "fs";

import { DCAT, DCTERMS, LDP, RDF, RDFS, VOID } from "@inrupt/vocab-common-rdf";
import { generateSession } from "../src/helpers/functions"
import { TokenSession } from "../src/helpers/interfaces";
import DataService from "../src/helpers/data-service";
const QueryEngine = require('@comunica/query-sparql').QueryEngine

let session: TokenSession;

const stakeholder = {
  webId: "http://localhost:3000/jeroen/profile/card#me",
  options: {
    name: "jwtoken",
    email: "jeroen.werbrouck@ugent.be",
    password: "test123",
    idp: "http://localhost:3000",
  }
}

const root = stakeholder.webId.replace("profile/card#me", "")

async function run() {
  const activeDocument = "http://localhost:3000/engineer/40050b82-9907-434c-91ab-7ce7c137d8b6"
  const selectedElement = "1l0GAJtRTFv8$zmKJOH4gQ"
  const aggregator = "http://localhost:3000/engineer/40050b82-9907-434c-91ab-7ce7c137d8b6"

  const session = await generateSession(stakeholder.options, stakeholder.webId)

  // find sparql endpoints within project
  const project = new Catalog(session, aggregator)
  const endpoints = await project.aggregateSparqlEndpoints()
  console.log('endpoints', endpoints)
}

console.log("starting")
run()