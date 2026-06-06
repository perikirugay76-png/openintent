# Agent Instructions

This repository is the source for OpenIntent, an open protocol for agent-readable intent, capability, consent, and match explanation.

## Locked Project Decisions

- Project name: `OpenIntent`
- Primary tagline: `OpenIntent is the intent layer for the agent web.`
- Canonical protocol object names: `IntentCard`, `CapabilityCard`, `ConsentPolicy`, `MatchReport`
- English docs are the canonical public protocol surface.
- Chinese docs are first-class companion docs for accurate collaboration and understanding.

## Protocol Boundaries

OpenIntent v0.1 is a protocol layer, not a hosted platform.

Do not turn the v0.1 core into:

- an agent framework
- a marketplace
- a search engine
- a model provider
- a hosted SaaS product
- a transport protocol
- a ranking algorithm

## Change Rules

- Schema changes must update matching examples and validator behavior.
- New protocol objects should start as RFCs before entering `spec/v0.1`.
- Keep the v0.1 core small. Prefer `extensions` for domain-specific fields.
- Do not rename `IntentCard` to `DemandCard` or `CapabilityCard` to `SupplyCard`.
- Keep examples realistic and runnable.
- Do not add negotiation, identity, registry, reputation, ranking, marketplace, or discovery features to v0.1 unless the human maintainer explicitly changes scope.
- Treat `Constraint`, `Preference`, `MatchReason`, and `MatchGap` as reusable semantic structures inside the four core objects, not as new top-level protocol objects.
- Keep the matcher as a reference example. Do not turn it into a complex ranking algorithm.

## Review Standards

Use these standards when evaluating every meaningful change:

- Positioning must stay concrete. If a document becomes a large vision statement without developer utility, tighten it.
- The project must stay a protocol for intent, capability, consent, and match explanation.
- Every addition must be understandable in five minutes, runnable in ten minutes, and useful locally without network effects.
- Schemas must define minimal verifiable semantics instead of allowing arbitrary natural-language blobs.
- Examples should make the agent web use case clear, not only prove that validation runs.
- Avoid premature complexity. Important future areas belong in roadmap or RFCs, not the v0.1 core.
- README changes should improve the first 30 seconds for a strong unfamiliar developer.

## Work Reports

After each batch of changes, report:

1. Files changed.
2. Goal of the change.
3. Uncertainties or disputed points.

Then review the batch using:

- what to keep
- what to remove
- what feels vague
- what is dangerous
- what has real value
- the next smallest useful change

## Verification

Run these commands before claiming changes are complete:

```bash
npm test
npm run validate:examples
npm run match:recruiting
```

## Documentation Tone

OpenIntent should read like a neutral infrastructure project. Avoid heavy SaaS language, sales copy, and claims that imply the protocol replaces MCP, A2A, ACP, OpenAPI, ActivityPub, or schema.org.
