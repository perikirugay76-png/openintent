import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { createMatchReport } from "../../matcher/src/index.js";
import { validateOpenIntentObject } from "../src/index.js";

const fixtureRoot = path.resolve("compliance/v0.1");

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(fixtureRoot, relativePath), "utf8"));
}

test("core compliance accepts all valid v0.1 protocol object fixtures", async () => {
  const fixtureFiles = [
    "valid/intent-card.json",
    "valid/capability-card.json",
    "valid/consent-policy.json",
    "valid/match-report.json"
  ];

  for (const fixtureFile of fixtureFiles) {
    const result = validateOpenIntentObject(await readJson(fixtureFile));
    assert.deepEqual(result, { valid: true, errors: [] }, fixtureFile);
  }
});

test("core compliance rejects clearly invalid v0.1 protocol object fixtures", async () => {
  const fixtureFiles = [
    "invalid/unknown-type.json",
    "invalid/intent-card-missing-consent.json",
    "invalid/consent-policy-missing-version.json",
    "invalid/match-report-invalid-score.json"
  ];

  for (const fixtureFile of fixtureFiles) {
    const result = validateOpenIntentObject(await readJson(fixtureFile));
    assert.equal(result.valid, false, fixtureFile);
    assert.ok(result.errors.length > 0, fixtureFile);
  }
});

test("reference loop check emits a valid MatchReport while preserving consent review", async () => {
  const intentCard = await readJson("valid/intent-card.json");
  const capabilityCard = await readJson("valid/capability-card.json");

  const report = createMatchReport(intentCard, capabilityCard);

  assert.equal(report.type, "MatchReport");
  assert.equal(report.intent_id, intentCard.id);
  assert.equal(report.capability_id, capabilityCard.id);
  assert.equal(report.requires_human_review, true);
  assert.deepEqual(validateOpenIntentObject(report), { valid: true, errors: [] });
});
