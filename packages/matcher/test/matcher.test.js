import test from "node:test";
import assert from "node:assert/strict";

import { createMatchReport } from "../src/index.js";
import { validateOpenIntentObject } from "../../validator/src/index.js";

const intentCard = {
  type: "IntentCard",
  version: "0.1",
  id: "intent_recruiting_001",
  actor: {
    type: "project",
    id: "https://github.com/openintent/openintent",
    name: "OpenIntent"
  },
  intent: {
    summary: "Find a senior TypeScript contributor for an open protocol project",
    category: "collaboration.recruiting",
    constraints: [
      {
        field: "interests",
        operator: "contains",
        value: "agents"
      }
    ],
    preferences: []
  },
  consent: {
    visibility: "public",
    can_store: true,
    can_forward: false,
    can_contact_matches: false,
    requires_human_approval: true
  }
};

const capabilityCard = {
  type: "CapabilityCard",
  version: "0.1",
  id: "capability_engineer_001",
  actor: {
    type: "person",
    id: "did:example:typescript-engineer",
    name: "TypeScript Protocol Engineer"
  },
  capability: {
    summary: "Contributes TypeScript SDKs, schema tooling, and protocol examples for agents",
    category: "collaboration.engineering",
    constraints: [],
    preferences: []
  },
  terms: {
    contact: "requires_approval"
  }
};

test("creates a valid MatchReport from an IntentCard and CapabilityCard", () => {
  const report = createMatchReport(intentCard, capabilityCard);

  assert.equal(report.type, "MatchReport");
  assert.equal(report.version, "0.1");
  assert.equal(report.intent_id, "intent_recruiting_001");
  assert.equal(report.capability_id, "capability_engineer_001");
  assert.equal(report.requires_human_review, true);
  assert.equal(report.status, "partial_match");
  assert.ok(report.score > 0);
  assert.ok(report.score <= 1);
  assert.ok(report.reasons.some((reason) => reason.code === "shared_summary_terms"));
  assert.ok(report.reasons.every((reason) => typeof reason.message === "string"));
  assert.ok(report.reasons.every((reason) => typeof reason.weight === "number"));
  assert.ok(report.gaps.some((gap) => gap.code === "category_mismatch"));
  assert.ok(report.gaps.every((gap) => typeof gap.suggested_resolution === "string"));
  assert.deepEqual(validateOpenIntentObject(report), { valid: true, errors: [] });
});

test("rejects invalid input cards before matching", () => {
  assert.throws(
    () => createMatchReport({ ...intentCard, type: "BadCard" }, capabilityCard),
    /intent card is invalid/
  );
});
