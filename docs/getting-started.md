# Getting Started

OpenIntent is not an intent recognition engine. It does not infer intent from raw text.

OpenIntent defines structured protocol objects that agents can exchange, validate, compare, and explain. Intent recognition systems may produce OpenIntent objects, but they are not OpenIntent itself.

## 1. What OpenIntent Is

OpenIntent v0.1 defines four core objects:

- `IntentCard`: what an actor wants.
- `CapabilityCard`: what an actor can provide.
- `ConsentPolicy`: what an agent is allowed to do.
- `MatchReport`: why one intent and one capability match, partially match, or do not match.

OpenIntent does not require a specific matcher, scoring algorithm, registry, marketplace, SDK, adapter, or agent framework.

## 2. Run The Existing Demo

From the repository root:

```bash
npm test
npm run validate:examples
npm run match:recruiting
```

`npm run match:recruiting` uses the reference matcher to demonstrate one valid OpenIntent loop. OpenIntent does not require implementations to use this matcher or this scoring algorithm.

## 3. Write An IntentCard

Save this as a local practice file such as `my-intent-card.json`:

```json
{
  "type": "IntentCard",
  "version": "0.1",
  "id": "intent_demo_001",
  "actor": {
    "type": "project",
    "id": "https://example.org/projects/demo",
    "name": "Demo Project"
  },
  "intent": {
    "summary": "Find help building JSON Schema validation examples",
    "category": "collaboration.protocol",
    "constraints": [
      {
        "field": "protocol_version",
        "operator": "equals",
        "value": "0.1",
        "required": true
      }
    ],
    "preferences": [
      {
        "field": "open_source_experience",
        "value": true,
        "weight": 0.6
      }
    ]
  },
  "consent": {
    "visibility": "public",
    "can_store": true,
    "can_forward": false,
    "can_contact_matches": false,
    "requires_human_approval": true
  }
}
```

`IntentCard.consent` is nested and does not include `type` or `version`.

## 4. Write A CapabilityCard

Save this as a local practice file such as `my-capability-card.json`:

```json
{
  "type": "CapabilityCard",
  "version": "0.1",
  "id": "capability_demo_001",
  "actor": {
    "type": "person",
    "id": "did:example:schema-contributor",
    "name": "Schema Contributor"
  },
  "capability": {
    "summary": "Can build JSON Schema validation examples for protocol projects",
    "category": "collaboration.protocol",
    "constraints": [
      {
        "field": "protocol_version",
        "operator": "equals",
        "value": "0.1"
      }
    ],
    "preferences": [
      {
        "field": "open_source_experience",
        "value": true,
        "weight": 0.7
      }
    ]
  },
  "terms": {
    "contact": "requires_approval"
  }
}
```

`CapabilityCard.terms` is required, but v0.1 does not prescribe a marketplace or contract model.

## 5. Validate Your Card

Run the validator against one or more card files:

```bash
node packages/validator/src/cli.js my-intent-card.json my-capability-card.json
```

Valid cards print `valid <file>`. Invalid cards print `invalid <file>` followed by one or more structural errors.

## 6. Read A MatchReport

A `MatchReport` explains the relationship between one `IntentCard` and one `CapabilityCard`.

Key fields:

- `score`: a number from `0` to `1`; it is not a global marketplace ranking.
- `status`: one of `match`, `partial_match`, or `no_match`.
- `reasons`: structured positive evidence.
- `gaps`: structured missing, weak, or conflicting evidence.
- `requires_human_review`: whether human approval is required before action.

`MatchReport` is an explanation object. It is not a registry result, search result, or ranking result.

## 7. Common Mistakes

- OpenIntent is not an `IntentParser`; do not put raw prompts where structured fields are expected.
- `IntentCard.consent` is nested and does not include `type` or `version`.
- A top-level `ConsentPolicy` includes `type` and `version`.
- `actor.id` is required.
- `Constraint.operator` must be one of `equals`, `not_equals`, `contains`, `in`, `not_in`, `>`, `>=`, `<`, or `<=`.
- `MatchReport.score` must be between `0` and `1`.
- `MatchReason` and `MatchGap` must be structured objects, not strings.
- The reference matcher is only a demo, not the required matching algorithm.
