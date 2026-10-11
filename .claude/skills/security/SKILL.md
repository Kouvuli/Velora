---
name: security
description: Reviews and writes code with application security in mind - input validation, authentication and authorization, secrets handling, injection, dependency risk, and sensitive data exposure, guided by the OWASP Top 10. Use when touching auth, user input, file uploads, payments, personal data, secrets, external integrations, or when asked for a security review.
license: MIT
---

# Security

## Purpose
Prevent the common, costly vulnerabilities in everyday changes, and give security reviews a consistent checklist.

## When to use
- Any change to authentication, authorization, sessions, input handling, file handling, crypto, payments, personal data, outbound calls, or dependencies.
- An explicit security review of a diff, endpoint or module.

## Procedure
1. **Map the trust boundaries** of the change: where untrusted data enters (HTTP, queues, files, env, third-party APIs) and where it reaches sensitive sinks (DB queries, shell, file paths, HTML, redirects, deserialization, logs).
2. **Check each boundary** with [the checklist](references/checklist.md). Most relevant per change:
   - Injection: parameterized queries / ORM bindings only; never build SQL, shell commands or paths from raw input.
   - AuthN/AuthZ: every endpoint enforces authorization server-side, per object (no IDOR); deny by default.
   - Secrets: from a secret manager or environment at runtime; never in code, logs, URLs, error messages or test fixtures.
   - Output: encode for the context (HTML, JSON, headers); safe redirects.
   - Data: collect and log the minimum; mask personal data in logs.
   - Dependencies: new packages are maintained, pinned, and from the official registry.
3. **Use deterministic tools first** where the project has them (secret scanners, SAST, dependency audit) and report their output; AI review complements, not replaces, them.
4. **Rate findings** by exploitability and impact (critical / high / medium / low) and propose the minimal fix with a test that proves it.
5. **Record** accepted risks or security decisions in `.ai/knowledge/decisions/`.

## Output
A findings table: location, issue, severity, evidence, fix. "No issues found" must list what was checked.

## Failure modes
- Client-side-only validation or authorization.
- Rolling your own crypto, tokens, or password hashing.
- Reporting theoretical issues without a concrete path from input to sink; or missing real ones because only the diff was read (check callers).
