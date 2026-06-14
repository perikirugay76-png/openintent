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

## v0.1 Decisions

- `IntentCard` embeds consent fields so permission travels with the intent. A standalone `ConsentPolicy` is also a core object for cases where the same policy is exchanged or validated independently. Embedded consent does not include `type` or `version`.
- The minimum compliant `MatchReport` identifies one intent and one capability, provides a score and status, explains reasons and gaps, and states whether human review is required.
- Recruiting is the first end-to-end reference example. It demonstrates the protocol loop without making recruiting part of the protocol core.

## Deferred Questions

Identity proofs, discovery, reputation, ranking, negotiation, and adapter behavior remain outside OpenIntent v0.1. They require separate RFCs before they can affect the core protocol.
