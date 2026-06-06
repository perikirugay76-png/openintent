# RFC 0001: OpenIntent v0.1 Core

## Status

Draft

## Summary

OpenIntent v0.1 defines the smallest useful protocol loop for agent-readable intent and capability matching:

- `IntentCard`
- `CapabilityCard`
- `ConsentPolicy`
- `MatchReport`

## Motivation

Agents can call tools and communicate with each other, but they lack a shared semantic format for expressing what an actor wants, what another actor can provide, what constraints matter, and what an agent is allowed to do next.

OpenIntent v0.1 provides that minimal format without defining hosting, ranking, payments, identity providers, marketplace rules, or agent runtime behavior.

## Core Objects

### IntentCard

Describes what an actor wants.

### CapabilityCard

Describes what an actor can provide.

### ConsentPolicy

Describes what an agent may do with an object or match.

### MatchReport

Explains why an intent and capability match, partially match, or do not match.

## Non-Goals

This RFC does not define:

- negotiation sessions
- audit and provenance trails
- `.well-known` discovery
- SDK APIs
- hosted marketplaces
- ranking algorithms

## Compatibility

The v0.1 core should be compatible with future adapters for MCP, A2A, ACP, OpenAPI, ActivityPub, and schema.org.

## Open Questions

- Should `ConsentPolicy` remain embedded in `IntentCard`, or also become a standalone reusable document?
- What is the minimum useful `MatchReport` for compliance testing?
- Which example domain should become the first end-to-end demo?
