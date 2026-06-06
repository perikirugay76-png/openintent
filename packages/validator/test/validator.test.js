import test from "node:test";
import assert from "node:assert/strict";

import { validateOpenIntentObject } from "../src/index.js";

test("accepts a minimal valid IntentCard", () => {
  const result = validateOpenIntentObject({
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
      constraints: [],
      preferences: []
    },
    consent: {
      visibility: "public",
      can_store: true,
      can_forward: false,
      can_contact_matches: false,
      requires_human_approval: true
    }
  });

  assert.deepEqual(result, { valid: true, errors: [] });
});

test("rejects a MatchReport score outside the accepted range", () => {
  const result = validateOpenIntentObject({
    type: "MatchReport",
    version: "0.1",
    intent_id: "intent_001",
    capability_id: "capability_001",
    score: 1.4,
    status: "match",
    reasons: [],
    gaps: [],
    requires_human_review: true
  });

  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /score must be between 0 and 1/);
});

test("rejects non-object constraints and preferences", () => {
  const result = validateOpenIntentObject({
    type: "IntentCard",
    version: "0.1",
    id: "intent_invalid_semantics",
    actor: {
      type: "project",
      id: "https://github.com/openintent/openintent"
    },
    intent: {
      summary: "Find a contributor",
      category: "collaboration.recruiting",
      constraints: ["must know TypeScript"],
      preferences: [
        {
          field: "open_source_contributions",
          weight: 1.4
        }
      ]
    },
    consent: {
      visibility: "public",
      can_store: true,
      can_forward: false,
      can_contact_matches: false,
      requires_human_approval: true
    }
  });

  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /intent.constraints\[0\] must be an object/);
  assert.match(result.errors.join("\n"), /intent.preferences\[0\].weight must be between 0 and 1/);
});

test("rejects string reasons and gaps in MatchReport", () => {
  const result = validateOpenIntentObject({
    type: "MatchReport",
    version: "0.1",
    intent_id: "intent_001",
    capability_id: "capability_001",
    score: 0.5,
    status: "partial_match",
    reasons: ["shared terms: protocol"],
    gaps: ["category differs"],
    requires_human_review: true
  });

  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /reasons\[0\] must be an object/);
  assert.match(result.errors.join("\n"), /gaps\[0\] must be an object/);
});

test("accepts MatchReason weight and MatchGap suggested_resolution as optional", () => {
  const result = validateOpenIntentObject({
    type: "MatchReport",
    version: "0.1",
    intent_id: "intent_001",
    capability_id: "capability_001",
    score: 0.5,
    status: "partial_match",
    reasons: [
      {
        code: "category_match",
        message: "Intent and capability categories match.",
        evidence: []
      }
    ],
    gaps: [
      {
        code: "missing_availability",
        message: "Capability does not state availability.",
        severity: "info"
      }
    ],
    requires_human_review: true
  });

  assert.deepEqual(result, { valid: true, errors: [] });
});

test("validates optional MatchReason weight and MatchGap suggested_resolution when present", () => {
  const result = validateOpenIntentObject({
    type: "MatchReport",
    version: "0.1",
    intent_id: "intent_001",
    capability_id: "capability_001",
    score: 0.5,
    status: "partial_match",
    reasons: [
      {
        code: "category_match",
        message: "Intent and capability categories match.",
        evidence: [],
        weight: 1.2
      }
    ],
    gaps: [
      {
        code: "missing_availability",
        message: "Capability does not state availability.",
        severity: "info",
        suggested_resolution: 42
      }
    ],
    requires_human_review: true
  });

  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /reasons\[0\].weight must be between 0 and 1/);
  assert.match(result.errors.join("\n"), /gaps\[0\].suggested_resolution must be a string/);
});
