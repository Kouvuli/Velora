---
name: architecture-diff
description: Shows what a change, branch or release does to the system's structure - new or removed components, endpoints, tables and dependencies between them - by comparing the evidence graph before and after (`ai-skills knowledge graph --since <ref>`), then checks the changes against recorded decisions (ADRs) and boundaries and flags drift. Use when reviewing the architectural impact of a pull request or branch, checking for layering or boundary violations, or comparing the architecture between two versions.
license: MIT
---

# Architecture diff

## Purpose
Catch structural drift while it is one pull request old: every new dependency is either intended and recorded, or flagged.

## When to use
- "What does this PR change architecturally?", "did this break our layering?", "compare the architecture of v1 and v2", before merging larger changes.

## When NOT to use
- Line-by-line correctness review: `code-review` (this skill looks at structure only).
- Designing a new structure or writing an ADR: `architecture`.

## Procedure
1. **Get the structural delta**: `ai-skills knowledge graph --since <base-ref>` (e.g. `main`) lists added/removed components, endpoints, tables and links (`depends_on`, `exposes`, `persists`, `maps_to`) with `file:line`. Without the CLI, read `git diff --stat <base>` and the changed files' imports, injections and routes.
2. **Load the rules**: ADRs (`docs/adr/`, `.ai/knowledge/decisions/`), recorded boundaries and conventions in `.ai/knowledge/architecture/`.
3. **Classify every structural change**: expected (follows the rules), new but undocumented (needs a decision), or a violation (cite the rule and the `file:line` that breaks it). Typical violations: a layer skipped (controller -> repository), a module reaching into another's internals or tables, a new cycle, a new external dependency nobody decided on.
4. **Explain the impact**: what the violation bypasses (e.g. business rules and permission checks in the service layer) and a concrete risk.
5. **Recommend**: fix the code to follow the rule, or record a new decision (ADR via `architecture`) if the rule should change. Never quietly accept drift.
6. **Update knowledge** for intended changes (`knowledge-update`).

## Output
Structural changes table (change, evidence, classification), violations with the rule they break, and recommendations.

## Failure modes
- Reviewing only the diff text and missing new dependencies created by injection or imports.
- Calling something a violation without citing the rule; treating undocumented as forbidden.
- Inventing rules the project never recorded.
