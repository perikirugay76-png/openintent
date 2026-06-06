# Contributing

OpenIntent should feel like a neutral protocol project, not a private product repository.

## Good First Contributions

- Add a realistic example in `examples/`.
- Improve a JSON Schema in `schemas/v0.1/`.
- Add a validator test in `packages/validator/test/`.
- Propose a small spec clarification in `spec/v0.1/`.

## Design Rules

- Keep the core small.
- Prefer schema-first changes.
- Add examples for new concepts.
- Do not add hosted-platform assumptions to the protocol core.
- Treat MCP, A2A, ACP, OpenAPI, ActivityPub, and schema.org as compatible ecosystems, not competitors.

## Proposal Flow

For larger changes, open an RFC-style document before implementation:

```text
rfcs/0001-short-title.md
```

The first RFC should explain motivation, proposed object changes, compatibility impact, examples, and migration notes.
