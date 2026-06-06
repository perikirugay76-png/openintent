# Design Rationale

This document explains current OpenIntent v0.1 design choices. It is not a roadmap, manifesto, or claim that these choices are final.

## Why structured cards instead of raw prompts?

Raw prompts are useful inputs, but they are not stable protocol objects. They are hard to validate, compare consistently, or explain across independent implementations.

OpenIntent uses structured cards so agents can exchange fields with minimal verifiable semantics. The goal is not to remove natural language, but to give agents a shared object shape for intent, capability, consent, and match explanation.

## Why IntentCard and CapabilityCard instead of demand and supply?

`IntentCard` and `CapabilityCard` describe what an actor wants and what an actor can provide without assuming a marketplace. The same object pair can represent collaboration, procurement, open-source help, service capability, or other agent-readable contexts.

`Demand` and `supply` are useful economic terms, but they would bias v0.1 toward commercial matching. OpenIntent keeps the core vocabulary neutral so domain-specific market language can live in examples, extensions, or future RFCs.

## Why is consent a core concern?

Agent-readable intent is incomplete without agent-readable permission. A card may be public to inspect but not safe to store, forward, or use for outbound contact.

`ConsentPolicy` keeps visibility, storage, forwarding, contact, and human approval constraints in the protocol surface. This makes consent available before an agent takes action, not only after a match has been found.

## Why does MatchReport explain instead of rank?

OpenIntent v0.1 does not define a ranking algorithm. Different implementations may score, filter, or prioritize matches differently depending on domain and context.

`MatchReport` explains one relationship between one `IntentCard` and one `CapabilityCard`. Its `reasons` and `gaps` make positive evidence and missing or conflicting evidence visible without turning the protocol into a marketplace ranking system.

## Why is OpenIntent not intent recognition?

OpenIntent does not infer intent from raw text. It defines structured objects that can be validated and exchanged after intent or capability has been expressed.

An intent recognition system may produce an `IntentCard`, and a user interface may help someone fill one out. Those systems are useful producers of OpenIntent objects, but they are outside the v0.1 core.

## How does OpenIntent relate to MCP, A2A, and ACP?

OpenIntent is designed to be compatible with tool and communication protocols. MCP helps agents call tools and access context. A2A and ACP help agents communicate.

OpenIntent sits at a different layer: it represents intent, capability, consent, and match explanation. It does not replace tool calling, agent communication, transport, identity, or runtime protocols.

## What belongs outside v0.1?

The v0.1 core should stay small. The following areas are intentionally outside the core unless they return through explicit RFCs:

- marketplace behavior
- registry or discovery systems
- ranking algorithms
- identity or reputation systems
- negotiation sessions
- SDK or adapter requirements
- model or NLP integration
- hosted SaaS behavior

Keeping these areas outside v0.1 lets the core focus on four protocol objects: `IntentCard`, `CapabilityCard`, `ConsentPolicy`, and `MatchReport`.
