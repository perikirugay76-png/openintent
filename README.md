# OpenIntent

**OpenIntent is the intent layer for the agent web.**

OpenIntent is an open protocol for agent-readable intent, capability, consent, and match explanation.

中文说明: [README.zh-CN.md](README.zh-CN.md)

New to OpenIntent? Start with [Getting Started](docs/getting-started.md).

MCP lets agents use tools. A2A and ACP let agents communicate. OpenIntent lets agents understand what someone wants, what someone can provide, what an agent is allowed to do, and why a match is good or bad.

## The Loop

```text
IntentCard + CapabilityCard -> MatchReport
                         with ConsentPolicy
```

An OpenIntent loop tells an agent:

```text
wants: find a TypeScript protocol contributor
offers: schema tooling and protocol examples
match: partial_match because categories differ but summaries overlap
consent: human review required before contact
```

OpenIntent does not define the transport, registry, marketplace, ranking algorithm, or agent runtime. It defines the semantic objects that make this loop readable.

## Try It

```bash
npm test
npm run validate:examples
npm run match:recruiting
```

`npm run match:recruiting` compares `examples/recruiting/intent-card.json` with `examples/recruiting/capability-card.json` and returns a valid `MatchReport`.

## Write A Card

Validate your own card:

```bash
node packages/validator/src/cli.js path/to/card.json
```

Use the examples as starting points:

```text
examples/recruiting/
examples/procurement/
examples/open-source-bounty/
```

## Contribute

Good first contributions:

- add a realistic domain example in `examples/`
- add a compliance fixture in `compliance/v0.1/`
- improve validator error coverage in `packages/validator/test/`
- clarify one protocol rule in `spec/v0.1/`

Larger object changes should start as RFCs in `rfcs/`. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Core Objects

OpenIntent v0.1 defines four primitives:

- `IntentCard` describes what an actor wants.
- `CapabilityCard` describes what an actor can provide.
- `ConsentPolicy` describes what an agent is allowed to do.
- `MatchReport` explains why an intent and capability match, partially match, or do not match.

The core objects use structured semantic parts such as `Constraint`, `Preference`, `MatchReason`, and `MatchGap`. These are not extra top-level protocol objects; they make the four primitives more agent-readable.

## Compliance

```bash
npm run compliance
```

The v0.1 compliance baseline checks protocol objects and minimum behavior. It does not verify matching quality. See [spec/v0.1/compliance.md](spec/v0.1/compliance.md).

## Example

```json
{
  "type": "IntentCard",
  "version": "0.1",
  "id": "intent_recruiting_001",
  "actor": {
    "type": "project",
    "id": "https://github.com/openintent/openintent",
    "name": "OpenIntent"
  },
  "intent": {
    "summary": "Find a senior TypeScript contributor for an open protocol project",
    "category": "collaboration.recruiting",
    "constraints": [
      {
        "field": "experience",
        "operator": ">=",
        "value": 5,
        "unit": "years",
        "required": true
      }
    ],
    "preferences": [
      {
        "field": "open_source_contributions",
        "value": true,
        "weight": 0.8
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

## What OpenIntent Is Not

OpenIntent is not:

- an agent framework
- a marketplace
- a search engine
- a model provider
- a hosted SaaS platform
- a transport protocol

It is a protocol layer that existing agents, apps, websites, APIs, and marketplaces can adopt.

## Relationship To Other Agent Protocols

OpenIntent is designed to sit above tool and communication protocols:

- MCP helps agents call tools and access context.
- A2A and ACP help agents communicate.
- OpenIntent helps agents represent intent, capability, consent, and match explanation.

The goal is compatibility, not replacement.

## Repository Layout

```text
spec/v0.1/              Protocol specification
schemas/v0.1/           JSON Schemas for core objects
compliance/v0.1/        Compliance baseline fixtures
examples/               Domain examples
packages/validator/     Dependency-free validator and CLI
packages/matcher/       Minimal explainable matcher for examples
```

## Status

Experimental. v0.1 is being designed.
