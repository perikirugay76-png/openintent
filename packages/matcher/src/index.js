import { validateOpenIntentObject } from "../../validator/src/index.js";

export function createMatchReport(intentCard, capabilityCard) {
  const intentValidation = validateOpenIntentObject(intentCard);
  if (!intentValidation.valid || intentCard.type !== "IntentCard") {
    throw new Error(`intent card is invalid: ${intentValidation.errors.join("; ")}`);
  }

  const capabilityValidation = validateOpenIntentObject(capabilityCard);
  if (!capabilityValidation.valid || capabilityCard.type !== "CapabilityCard") {
    throw new Error(`capability card is invalid: ${capabilityValidation.errors.join("; ")}`);
  }

  const reasons = [];
  const gaps = [];

  const intentCategory = intentCard.intent.category;
  const capabilityCategory = capabilityCard.capability.category;
  if (intentCategory === capabilityCategory) {
    reasons.push({
      code: "category_match",
      message: `Intent and capability share category ${intentCategory}.`,
      evidence: [
        {
          field: "category",
          intent_value: intentCategory,
          capability_value: capabilityCategory
        }
      ],
      weight: 0.5
    });
  } else {
    gaps.push({
      code: "category_mismatch",
      message: `Intent category ${intentCategory} differs from capability category ${capabilityCategory}.`,
      severity: "warning",
      suggested_resolution: "Confirm whether the capability category is close enough for this intent."
    });
  }

  const sharedTerms = findSharedTerms(intentCard.intent.summary, capabilityCard.capability.summary);
  if (sharedTerms.length > 0) {
    reasons.push({
      code: "shared_summary_terms",
      message: `Intent and capability summaries share ${sharedTerms.length} meaningful terms.`,
      evidence: sharedTerms.slice(0, 8).map((term) => ({
        field: "summary",
        value: term
      })),
      weight: Math.min(1, sharedTerms.length / 5)
    });
  } else {
    gaps.push({
      code: "no_shared_summary_terms",
      message: "Intent and capability summaries do not share meaningful terms.",
      severity: "info",
      suggested_resolution: "Add more specific capability or intent summary terms."
    });
  }

  const score = calculateScore({
    categoryMatches: intentCategory === capabilityCategory,
    sharedTermCount: sharedTerms.length,
    gapCount: gaps.length
  });

  return {
    type: "MatchReport",
    version: "0.1",
    intent_id: intentCard.id,
    capability_id: capabilityCard.id,
    score,
    status: statusForScore(score),
    reasons,
    gaps,
    requires_human_review: intentCard.consent.requires_human_approval || !intentCard.consent.can_contact_matches
  };
}

function calculateScore({ categoryMatches, sharedTermCount, gapCount }) {
  const categoryScore = categoryMatches ? 0.5 : 0.15;
  const termScore = Math.min(sharedTermCount, 5) * 0.1;
  const gapPenalty = Math.min(gapCount, 3) * 0.05;
  return roundToTwoDecimals(Math.max(0, Math.min(1, categoryScore + termScore - gapPenalty)));
}

function statusForScore(score) {
  if (score >= 0.75) {
    return "match";
  }
  if (score >= 0.25) {
    return "partial_match";
  }
  return "no_match";
}

function findSharedTerms(left, right) {
  const leftTerms = new Set(tokenize(left));
  const rightTerms = new Set(tokenize(right));
  return [...leftTerms].filter((term) => rightTerms.has(term)).sort();
}

function tokenize(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((term) => term.length >= 4)
    .filter((term) => !STOP_WORDS.has(term));
}

function roundToTwoDecimals(value) {
  return Math.round(value * 100) / 100;
}

const STOP_WORDS = new Set([
  "that",
  "this",
  "with",
  "from",
  "into",
  "find",
  "open"
]);
