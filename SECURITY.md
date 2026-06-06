# Security Policy

OpenIntent is experimental and does not currently provide hosted services.

## Reporting Security Issues

If you find a security issue in the validator, schemas, examples, or repository automation, please open a GitHub issue with:

- affected file or package
- reproduction steps
- expected impact
- suggested fix, if known

Avoid posting sensitive private data in examples or issue comments.

## Protocol Safety

OpenIntent v0.1 treats consent as a core protocol concern. Implementations should not contact third parties, forward private data, or perform outbound actions when the relevant `ConsentPolicy` disallows it.
