const CORE_TYPES = new Set([
  "IntentCard",
  "CapabilityCard",
  "ConsentPolicy",
  "MatchReport"
]);

const ACTOR_TYPES = new Set([
  "person",
  "organization",
  "agent",
  "service",
  "project"
]);

const VISIBILITY_VALUES = new Set(["private", "shared", "public"]);
const MATCH_STATUSES = new Set(["match", "partial_match", "no_match"]);
const CONSTRAINT_OPERATORS = new Set([
  "equals",
  "not_equals",
  "contains",
  "in",
  "not_in",
  ">",
  ">=",
  "<",
  "<="
]);
const GAP_SEVERITIES = new Set(["info", "warning", "blocking"]);

export function validateOpenIntentObject(value) {
  const errors = [];

  if (!isObject(value)) {
    return { valid: false, errors: ["object must be a JSON object"] };
  }

  if (!CORE_TYPES.has(value.type)) {
    errors.push("type must be one of IntentCard, CapabilityCard, ConsentPolicy, MatchReport");
    return result(errors);
  }

  switch (value.type) {
    case "IntentCard":
      validateIntentCard(value, errors);
      break;
    case "CapabilityCard":
      validateCapabilityCard(value, errors);
      break;
    case "ConsentPolicy":
      requireString(value, "version", errors);
      requireExact(value, "version", "0.1", errors);
      validateConsentPolicy(value, errors, "");
      break;
    case "MatchReport":
      validateMatchReport(value, errors);
      break;
  }

  return result(errors);
}

function validateIntentCard(value, errors) {
  requireString(value, "version", errors);
  requireExact(value, "version", "0.1", errors);
  requireString(value, "id", errors);
  validateActor(value.actor, errors, "actor");
  validateNamedBlock(value.intent, errors, "intent");
  validateConsentPolicy(value.consent, errors, "consent");
}

function validateCapabilityCard(value, errors) {
  requireString(value, "version", errors);
  requireExact(value, "version", "0.1", errors);
  requireString(value, "id", errors);
  validateActor(value.actor, errors, "actor");
  validateNamedBlock(value.capability, errors, "capability");
  if (!isObject(value.terms)) {
    errors.push("terms must be an object");
  }
}

function validateMatchReport(value, errors) {
  requireString(value, "version", errors);
  requireExact(value, "version", "0.1", errors);
  requireString(value, "intent_id", errors);
  requireString(value, "capability_id", errors);
  if (typeof value.score !== "number" || value.score < 0 || value.score > 1) {
    errors.push("score must be between 0 and 1");
  }
  if (!MATCH_STATUSES.has(value.status)) {
    errors.push("status must be one of match, partial_match, no_match");
  }
  requireArray(value, "reasons", errors);
  requireArray(value, "gaps", errors);
  if (Array.isArray(value.reasons)) {
    value.reasons.forEach((reason, index) => {
      validateMatchReason(reason, errors, `reasons[${index}]`);
    });
  }
  if (Array.isArray(value.gaps)) {
    value.gaps.forEach((gap, index) => {
      validateMatchGap(gap, errors, `gaps[${index}]`);
    });
  }
  requireBoolean(value, "requires_human_review", errors);
}

function validateActor(value, errors, path) {
  if (!isObject(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  if (!ACTOR_TYPES.has(value.type)) {
    errors.push(`${path}.type must be one of person, organization, agent, service, project`);
  }
  requireString(value, "id", errors, path);
  if ("name" in value && typeof value.name !== "string") {
    errors.push(`${path}.name must be a string`);
  }
}

function validateNamedBlock(value, errors, path) {
  if (!isObject(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  requireString(value, "summary", errors, path);
  requireString(value, "category", errors, path);
  requireArray(value, "constraints", errors, path);
  requireArray(value, "preferences", errors, path);
  if (Array.isArray(value.constraints)) {
    value.constraints.forEach((constraint, index) => {
      validateConstraint(constraint, errors, `${path}.constraints[${index}]`);
    });
  }
  if (Array.isArray(value.preferences)) {
    value.preferences.forEach((preference, index) => {
      validatePreference(preference, errors, `${path}.preferences[${index}]`);
    });
  }
}

function validateConsentPolicy(value, errors, path) {
  const prefix = path ? `${path}.` : "";
  if (!isObject(value)) {
    errors.push(`${path || "object"} must be an object`);
    return;
  }
  if (!VISIBILITY_VALUES.has(value.visibility)) {
    errors.push(`${prefix}visibility must be one of private, shared, public`);
  }
  requireBoolean(value, "can_store", errors, path);
  requireBoolean(value, "can_forward", errors, path);
  requireBoolean(value, "can_contact_matches", errors, path);
  requireBoolean(value, "requires_human_approval", errors, path);
}

function validateConstraint(value, errors, path) {
  if (!isObject(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  requireString(value, "field", errors, path);
  if (!CONSTRAINT_OPERATORS.has(value.operator)) {
    errors.push(`${path}.operator must be one of ${[...CONSTRAINT_OPERATORS].join(", ")}`);
  }
  if (!("value" in value)) {
    errors.push(`${path}.value is required`);
  }
  if ("required" in value && typeof value.required !== "boolean") {
    errors.push(`${path}.required must be a boolean`);
  }
  if ("description" in value && typeof value.description !== "string") {
    errors.push(`${path}.description must be a string`);
  }
}

function validatePreference(value, errors, path) {
  if (!isObject(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  requireString(value, "field", errors, path);
  if ("weight" in value && (typeof value.weight !== "number" || value.weight < 0 || value.weight > 1)) {
    errors.push(`${path}.weight must be between 0 and 1`);
  }
  if ("description" in value && typeof value.description !== "string") {
    errors.push(`${path}.description must be a string`);
  }
}

function validateMatchReason(value, errors, path) {
  if (!isObject(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  requireString(value, "code", errors, path);
  requireString(value, "message", errors, path);
  requireArray(value, "evidence", errors, path);
  if ("weight" in value && (typeof value.weight !== "number" || value.weight < 0 || value.weight > 1)) {
    errors.push(`${path}.weight must be between 0 and 1`);
  }
}

function validateMatchGap(value, errors, path) {
  if (!isObject(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  requireString(value, "code", errors, path);
  requireString(value, "message", errors, path);
  if (!GAP_SEVERITIES.has(value.severity)) {
    errors.push(`${path}.severity must be one of info, warning, blocking`);
  }
  if ("suggested_resolution" in value && typeof value.suggested_resolution !== "string") {
    errors.push(`${path}.suggested_resolution must be a string`);
  }
}

function requireString(value, key, errors, path = "") {
  if (typeof value[key] !== "string" || value[key].length === 0) {
    errors.push(`${joinPath(path, key)} must be a non-empty string`);
  }
}

function requireExact(value, key, expected, errors, path = "") {
  if (value[key] !== expected) {
    errors.push(`${joinPath(path, key)} must be ${expected}`);
  }
}

function requireArray(value, key, errors, path = "") {
  if (!Array.isArray(value[key])) {
    errors.push(`${joinPath(path, key)} must be an array`);
  }
}

function requireBoolean(value, key, errors, path = "") {
  if (typeof value[key] !== "boolean") {
    errors.push(`${joinPath(path, key)} must be a boolean`);
  }
}

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function joinPath(path, key) {
  return path ? `${path}.${key}` : key;
}

function result(errors) {
  return { valid: errors.length === 0, errors };
}
