# OpenIntent v0.1 Compliance Baseline

OpenIntent v0.1 compliance baseline is not a certification program.
It defines minimum checks that help implementations verify that they can read, validate, and produce OpenIntent-compatible objects.

Compliance baseline checks protocol objects and minimum behavior. It does not verify matching quality.

## Scope

Core compliance focuses on protocol objects:

- accept valid `IntentCard` objects
- accept valid `CapabilityCard` objects
- accept valid `ConsentPolicy` objects
- accept valid `MatchReport` objects
- reject clearly invalid v0.1 objects
- preserve the v0.1 object semantics defined in this specification

Reference loop checks demonstrate one valid intent-to-match-report flow, but OpenIntent does not mandate a ranking or matching algorithm.

## Non-Goals

The v0.1 compliance baseline does not define:

- certification, badges, or official implementation status
- matching quality
- ranking quality
- marketplace readiness
- discovery compliance
- identity compliance
- adapter compliance
- production-ready agent behavior

## Fixtures

Compliance fixtures live in:

```text
compliance/v0.1/
```

`valid/` contains minimal valid fixtures for the four core protocol objects.
`invalid/` contains clearly invalid fixtures that a v0.1 validator should reject.

These fixtures are intentionally separate from `examples/`. Examples explain realistic use cases. Compliance fixtures define stable implementation boundaries.

## Running Checks

Run:

```bash
npm run compliance
```

The current repository implementation reuses the dependency-free validator for core object checks. It also runs an optional reference loop check that verifies the reference matcher can accept a valid `IntentCard` and `CapabilityCard`, emit a valid `MatchReport`, and preserve consent review requirements.

The reference loop check is not a requirement that every OpenIntent implementation provide a matcher.
