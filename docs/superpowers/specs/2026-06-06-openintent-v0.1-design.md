# OpenIntent v0.1 Design

## Decision

The project name is `OpenIntent`.

The primary tagline is:

> OpenIntent is the intent layer for the agent web.

The public protocol language will use `IntentCard` and `CapabilityCard` as the core demand and supply objects. The words demand and supply remain useful explanatory language, but they are not the primary object names for v0.1.

## Positioning

OpenIntent fills the semantic layer above tool calling and agent communication:

- MCP helps agents call tools.
- A2A and ACP help agents communicate.
- OpenIntent helps agents express, understand, match, and eventually negotiate intent and capability.

OpenIntent is not an agent framework, marketplace, hosted SaaS platform, model provider, or transport protocol.

## v0.1 Scope

OpenIntent v0.1 defines the smallest useful loop:

1. An actor publishes or creates an `IntentCard`.
2. Another actor publishes or creates a `CapabilityCard`.
3. A local matcher compares them.
4. The matcher returns a `MatchReport`.
5. Any outward action is constrained by a `ConsentPolicy`.

The v0.1 repository should include:

- A concise README.
- A small protocol spec in `spec/v0.1`.
- JSON Schemas for all core objects.
- Real examples across multiple domains.
- A dependency-light validator package.
- A runnable test suite.

## Core Objects

`IntentCard` describes what an actor wants.

`CapabilityCard` describes what an actor can provide.

`ConsentPolicy` describes what an agent may do with an object or match.

`MatchReport` explains why an intent and capability match, partially match, or do not match.

## Future Extensions

These concepts matter, but they should not enlarge the v0.1 core:

- identity proofs
- long-lived profiles
- negotiation sessions
- audit and provenance trails
- `.well-known` discovery
- MCP, A2A, ACP, OpenAPI, ActivityPub, and schema.org adapters

## Success Criteria

A developer who opens the repository should understand the project in under one minute, run validation in under five minutes, and see a credible path from examples to protocol adoption.
