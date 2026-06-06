# OpenIntent v0.1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the first public OpenIntent repository shape with protocol docs, schemas, examples, and a runnable validator.

**Architecture:** Keep the protocol as source-readable documents and JSON Schema files. Keep the validator dependency-free so contributors can run it immediately with Node.js.

**Tech Stack:** Markdown, JSON Schema draft 2020-12 style documents, Node.js ESM, Node built-in test runner.

---

### Task 1: Project Narrative

**Files:**
- Create: `README.md`
- Create: `spec/v0.1/README.md`
- Create: `ROADMAP.md`
- Create: `CONTRIBUTING.md`
- Create: `LICENSE`

- [ ] Write the README around the locked tagline: `OpenIntent is the intent layer for the agent web.`
- [ ] Describe the relationship to MCP, A2A, and ACP without making OpenIntent depend on them.
- [ ] Define v0.1 non-goals so the project does not look like a marketplace or hosted SaaS.

### Task 2: Schemas and Examples

**Files:**
- Create: `schemas/v0.1/intent-card.schema.json`
- Create: `schemas/v0.1/capability-card.schema.json`
- Create: `schemas/v0.1/consent-policy.schema.json`
- Create: `schemas/v0.1/match-report.schema.json`
- Create: `examples/recruiting/intent-card.json`
- Create: `examples/recruiting/capability-card.json`
- Create: `examples/procurement/intent-card.json`
- Create: `examples/open-source-bounty/intent-card.json`

- [ ] Define required fields for the four core objects.
- [ ] Keep domain-specific fields in `extensions` or simple example values.
- [ ] Make every example validate against its schema.

### Task 3: Validator

**Files:**
- Create: `package.json`
- Create: `packages/validator/package.json`
- Create: `packages/validator/src/index.js`
- Create: `packages/validator/src/cli.js`
- Create: `packages/validator/test/validator.test.js`

- [ ] Write tests first for valid and invalid cards.
- [ ] Implement a small validator that checks required fields, type constants, enum values, and score ranges.
- [ ] Add a CLI command for validating JSON files.

### Task 4: Verification

**Commands:**
- `npm test`
- `npm run validate:examples`

- [ ] Confirm unit tests pass.
- [ ] Confirm examples validate.
- [ ] Inspect git status before reporting completion.
