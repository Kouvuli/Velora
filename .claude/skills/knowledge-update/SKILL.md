---
name: knowledge-update
description: Keeps the project's knowledge base in .ai/knowledge/ true after a change - refreshes generated facts, API, schema and graph from source, records new decisions and facts with file evidence and the right status (CONFIRMED, INFERRED, UNKNOWN, STALE, CONFLICTING), and resolves stale items. Use after code, schema, API, infrastructure or requirement changes, when knowledge check reports problems, or when asked to update project knowledge.
license: MIT
---

# Knowledge update

## Purpose
Project knowledge is only useful while it is true. Update it from evidence so the next task can trust it instead of re-reading the whole codebase.

## When to use
- After a change to code, schema, API contracts, infrastructure or requirements.
- When `ai-skills knowledge check` reports STALE, missing evidence or changed sources.
- Before work in an unfamiliar area, to see what is known and how sure it is.

## When NOT to use
- Recording a failure and its cause: use `retrospective`.
- Writing user-facing docs or a README: use `documentation`.

## Procedure
1. **Refresh generated knowledge**: `ai-skills knowledge discover` (stack facts, API contracts, schema from migrations/Prisma, ADR index, graph), then `ai-skills knowledge check`. If the CLI is unavailable, do the same by hand from the sources.
2. **Find what changed**: `git diff`/`git log` since the last knowledge update, changed requirement documents, and what the check reported.
3. **Update hand-written items** in the matching folder (`architecture/`, `domain/`, `api/`, `database/`, `infrastructure/`, `dependencies/`, `decisions/`, `issues/`), one fact or topic per file, with frontmatter `status` and `evidence` (file paths).
4. **Choose the status honestly**:
   - CONFIRMED only with evidence from a source (code, tests, schema, contract, ADR);
   - INFERRED for your conclusions; never upgrade to CONFIRMED without new evidence;
   - UNKNOWN for known gaps; CONFLICTING when sources disagree (cite both);
   - STALE when the evidence changed or vanished. Keep it for review; do not delete it silently.
   Source-of-truth order: code > tests > schema > API contracts > requirements > ADRs > docs > index/graph > inference.
5. **Record decisions** that the change embodies as ADRs (`decisions/`) when they constrain future work.
6. **Stamp and re-check**: `ai-skills knowledge check --stamp`, then report what was added, changed, marked stale or left unknown.

Requirements and tickets are knowledge too: a finished ticket moves to `state: done`; a change that alters agreed
behaviour goes back through the `requirements` skill (new revision, draft) instead of being edited silently.
Run `ai-skills knowledge discover` so the graph links new code and tests to their criteria.

## Output
A short list: items added / updated / marked STALE or CONFLICTING (with paths), and remaining check warnings.

## Failure modes
- Marking a guess CONFIRMED; copying a requirement's plan as if it were built.
- Deleting stale items instead of marking them.
- Rewriting generated files by hand (they carry `generated_by`; re-run discover instead).
- Copying secrets, credentials, client rates or personal data into knowledge files.
