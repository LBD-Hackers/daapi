"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const _NAMESPACE = "https://w3id.org/consolid#";
const PREFIX = "consolid";

function _NS(localName) {
  return _NAMESPACE + localName;
}

const CONSOLID = {
  PREFIX: PREFIX,
  NAMESPACE: _NAMESPACE,
  PREFIX_AND_NAMESPACE: {
    [PREFIX]: _NAMESPACE
  },
  NS: _NS,
  Aggregator: _NS("Aggregator"),
  Project: _NS("Project"),
  // add to ontology
  Concept: _NS("Concept"),
  StringBasedIdentifier: _NS("StringBasedIdentifier"),
  URIBasedIdentifier: _NS("URIBasedIdentifier"),
  ReferenceRegistry: _NS("ReferenceRegistry"),
  hasReference: _NS("hasReference"),
  inDataset: _NS("inDataset"),
  inDocument: _NS("inDocument"),
  hasIdentifier: _NS("hasIdentifier"),
  value: _NS("value"),
  aggregates: _NS("aggregates"),
  hasProjectRegistry: _NS("hasProjectRegistry"),
  hasDatasetRegistry: _NS("hasDatasetRegistry"),
  hasReferenceRegistry: _NS("hasReferenceRegistry"),
  hasServiceRegistry: _NS("hasServiceRegistry"),
  hasSatellite: _NS("hasSatellite"),
  ProjectInvite: _NS("ProjectInvite") // add to ontology

};
var _default = CONSOLID;
exports.default = _default;
//# sourceMappingURL=consolid.js.map