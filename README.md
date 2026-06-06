# OpenIntent

**OpenIntent is the intent layer for the agent web.**

OpenIntent is an open protocol for agent-readable intent, capability, consent, and match explanation.

中文说明: [README.zh-CN.md](README.zh-CN.md)

Agents can already call tools. Agents can already communicate with other agents. They still need a shared way to express what someone wants, what someone can provide, what constraints matter, what an agent is allowed to do, and why a match is good or bad.

OpenIntent defines that semantic layer.

## Why

The web is human-readable. APIs are machine-callable. The agent web needs to be intent-readable.

OpenIntent lets people, companies, services, projects, APIs, and agents publish structured intent and capability objects that other agents can understand, compare, filter, and explain.

## Core Objects

OpenIntent v0.1 defines four primitives:

- `IntentCard` describes what an actor wants.
- `CapabilityCard` describes what an actor can provide.
- `ConsentPolicy` describes what an agent is allowed to do.
- `MatchReport` explains why an intent and capability match, partially match, or do not match.

The core objects use structured semantic parts such as `Constraint`, `Preference`, `MatchReason`, and `MatchGap`. These are not extra top-level protocol objects; they make the four primitives more agent-readable.

## Quick Start

Validate the included examples:

```bash
npm test
npm run validate:examples
```

Run your first match:

```bash
npm run match:recruiting
```

This compares `examples/recruiting/intent-card.json` with `examples/recruiting/capability-card.json` and returns a valid `MatchReport`.

Validate your own card:

```bash
node packages/validator/src/cli.js path/to/card.json
```

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
examples/               Domain examples
packages/validator/     Dependency-free validator and CLI
packages/matcher/       Minimal explainable matcher for examples
```

## Status

Experimental. v0.1 is being designed.
