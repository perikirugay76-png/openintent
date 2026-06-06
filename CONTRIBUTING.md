# Contributing

OpenIntent should feel like a neutral protocol project, not a private product repository.

## Good First Contributions

- Add a realistic example in `examples/`.
- Add a valid or invalid compliance fixture in `compliance/v0.1/`.
- Improve a JSON Schema in `schemas/v0.1/`.
- Add a validator test in `packages/validator/test/`.
- Propose a small spec clarification in `spec/v0.1/`.

## Contribution Map

- **Examples:** add realistic `IntentCard`, `CapabilityCard`, `ConsentPolicy`, or `MatchReport` examples that make the agent web use case clearer.
- **Compliance:** add focused fixtures that clarify what a v0.1 implementation should accept or reject.
- **Schemas:** tighten reusable structure definitions without expanding the v0.1 core.
- **Validator:** improve validation coverage and error clarity while keeping the validator dependency-free.
- **RFCs:** propose larger protocol changes before adding new objects or fields to `spec/v0.1/`.

## Design Rules

- Keep the core small.
- Prefer schema-first changes.
- Add examples for new concepts.
- Do not add hosted-platform assumptions to the protocol core.
- Treat MCP, A2A, ACP, OpenAPI, ActivityPub, and schema.org as compatible ecosystems, not competitors.
- Do not add marketplace, registry, ranking, reputation, identity, discovery, negotiation, or adapter behavior to the v0.1 core.

## Proposal Flow

For larger changes, open an RFC-style document before implementation:

```text
rfcs/0001-short-title.md
```

The first RFC should explain motivation, proposed object changes, compatibility impact, examples, and migration notes.
