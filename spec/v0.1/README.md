# OpenIntent Spec v0.1

OpenIntent defines a minimal semantic protocol for AI agents to exchange, compare, and explain structured intent and capability.

## 1. Design Principles

### 1.1 Agent-Readable

Objects must be easy for agents to parse, validate, compare, and explain.

### 1.2 Human-Controllable

Agents may reason and recommend, but sensitive actions require explicit consent.

### 1.3 Protocol, Not Platform

OpenIntent does not define hosting, ranking, payments, identity providers, marketplaces, or model behavior.

### 1.4 Small Core, Extensible Edges

The core protocol should remain small. Domain-specific fields belong in extensions.

## 2. Core Objects

### 2.1 IntentCard

An `IntentCard` describes what an actor wants.

Required fields:

```json
{
  "type": "IntentCard",
  "version": "0.1",
  "id": "intent_123",
  "actor": {},
  "intent": {},
  "consent": {}
}
```

### 2.2 CapabilityCard

A `CapabilityCard` describes what an actor can provide.

Required fields:

```json
{
  "type": "CapabilityCard",
  "version": "0.1",
  "id": "capability_123",
  "actor": {},
  "capability": {},
  "terms": {}
}
```

### 2.3 ConsentPolicy

A `ConsentPolicy` describes what an agent may do with an object.

Required fields:

```json
{
  "type": "ConsentPolicy",
  "version": "0.1",
  "visibility": "private",
  "can_store": true,
  "can_forward": false,
  "can_contact_matches": false,
  "requires_human_approval": true
}
```

### 2.4 MatchReport

A `MatchReport` explains the relationship between an `IntentCard` and a `CapabilityCard`.

Required fields:

```json
{
  "type": "MatchReport",
  "version": "0.1",
  "intent_id": "intent_123",
  "capability_id": "capability_123",
  "score": 0.82,
  "status": "match",
  "reasons": [],
  "gaps": [],
  "requires_human_review": true
}
```

## 3. Actor

An `actor` is the entity represented by an object.

```json
{
  "type": "person",
  "id": "did:example:alice",
  "name": "Alice"
}
```

Allowed actor types:

- `person`
- `organization`
- `agent`
- `service`
- `project`

OpenIntent does not require a specific identity system in v0.1.

## 4. Reusable Semantic Structures

OpenIntent v0.1 keeps the top-level protocol small, but its arrays should still be structured enough for agents to compare and explain.

### 4.1 Constraint

`Constraint` objects appear inside `intent.constraints` and `capability.constraints`.

```json
{
  "field": "experience",
  "operator": ">=",
  "value": 5,
  "unit": "years",
  "required": true,
  "description": "Minimum relevant experience"
}
```

Fields:

- `field`: the target field being constrained.
- `operator`: one of `equals`, `not_equals`, `contains`, `in`, `not_in`, `>`, `>=`, `<`, `<=`.
- `value`: the comparison value. v0.1 allows scalars, arrays, and objects.
- `required`: optional boolean. If `true`, a matcher should treat failure or inability to evaluate as a gap.
- `description`: optional human-readable explanation.

`unit` is a recommended extension field for ordered values. It helps matchers interpret numeric comparisons such as years, days, or hours per week, but it is not required by the v0.1 core schema.

Operator semantics:

- `equals` and `not_equals` compare scalar, array, or object values for exact semantic equality.
- `contains` checks whether the candidate value contains the constraint value. It is intended for strings, arrays, and tag-like fields.
- `in` checks whether the candidate value is included in the constraint `value`, which should be an array.
- `not_in` checks whether the candidate value is absent from the constraint `value`, which should be an array.
- `>`, `>=`, `<`, and `<=` compare ordered values. v0.1 matchers should prefer numeric values for these operators. If units matter, include a separate unit field such as `"unit": "years"`.

If a matcher cannot evaluate a constraint value or operator, it should report a `MatchGap` instead of silently ignoring the constraint.

### 4.2 Preference

`Preference` objects appear inside `intent.preferences` and `capability.preferences`.

```json
{
  "field": "open_source_contributions",
  "value": true,
  "weight": 0.8,
  "description": "Open-source work is preferred but not required"
}
```

### 4.3 MatchReason

`MatchReason` objects explain positive evidence in a `MatchReport`.

```json
{
  "code": "shared_summary_terms",
  "message": "Intent and capability summaries share meaningful terms.",
  "evidence": [],
  "weight": 0.4
}
```

`weight` is optional. If present, it must be a number from `0` to `1`. Implementations should not invent fake precision when they cannot assign a meaningful weight.

### 4.4 MatchGap

`MatchGap` objects explain missing, weak, or conflicting evidence in a `MatchReport`.

```json
{
  "code": "category_mismatch",
  "message": "Intent and capability categories differ.",
  "severity": "warning",
  "suggested_resolution": "Confirm whether the capability category is close enough for this intent."
}
```

`suggested_resolution` is optional. If present, it should describe a concrete next step for resolving the gap.

## 5. Matching

OpenIntent does not mandate a ranking algorithm.

A compliant matcher must:

- accept at least one valid `IntentCard`
- accept at least one valid `CapabilityCard`
- return a valid `MatchReport`
- explain positive reasons
- explain gaps or mismatches
- preserve consent constraints

## 6. Consent

Agents must preserve consent constraints before outbound action.

In v0.1, outbound contact should not occur when `can_contact_matches` is `false`, and human approval is required when `requires_human_approval` is `true`.

## 7. Future Scope

Future versions may define:

- identity proofs
- long-lived profiles
- negotiation sessions
- audit and provenance trails
- `.well-known/openintent.json`
- adapters for MCP, A2A, ACP, OpenAPI, ActivityPub, and schema.org

## 8. Non-Goals

OpenIntent v0.1 does not define:

- payments
- marketplace ranking
- reputation
- hosting
- model behavior
- transport protocol
- agent runtime
- legal contract enforcement
