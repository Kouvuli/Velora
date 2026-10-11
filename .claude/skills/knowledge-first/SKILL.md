---
name: knowledge-first
description: Starts significant tasks from the project's recorded knowledge instead of re-reading the whole codebase - search .ai/knowledge and the evidence graph for the components, endpoints, tables and decisions involved, read the cited source to confirm what matters, then work, and flag knowledge that turned out wrong. Use at the start of any non-trivial task in a project that has .ai/knowledge, or when asked what is known about a part of the system.
license: MIT
---

# Knowledge first

## Purpose
Spend tokens on the task, not on rediscovering the project: retrieve what is already known, verify only what the task depends on, and keep the knowledge honest.

## When to use
- Before planning or changing code in an initialized project (`.ai/knowledge/` exists); "what do we know about X?", "what uses this table?".

## When NOT to use
- Updating the knowledge after a change: `knowledge-update`.
- Tiny mechanical edits (typos, renames in one file) where reading the file is cheaper.

## Procedure
1. **Search**: `ai-skills knowledge search <terms> --json` for items and requirement docs, and `ai-skills knowledge graph <name>` (component, endpoint path, table, technology) for what it connects to, with `file:line` evidence. Without the CLI, read `.ai/knowledge/` directly (`index/facts.yaml`, `index/graph.yaml`, the topic folders).
2. **Read statuses**: CONFIRMED items have evidence; INFERRED are someone's conclusion; UNKNOWN are open questions; STALE and CONFLICTING must not be relied on. Run `ai-skills knowledge check` if staleness matters.
3. **Verify what the task depends on**: open the cited files for anything correctness-critical (security, data, money, public APIs). The graph and knowledge are an index, not the truth; the source wins.
4. **Use recorded decisions**: follow ADRs and recorded conventions; if the task needs to break one, say so explicitly and why.
5. **Work**, citing the knowledge you relied on.
6. **Flag drift**: knowledge that was wrong or missing becomes an item for `knowledge-update` (or tell the user), never a silent fix in your head.

## Output
A short "what I relied on" list (item or graph edge -> verified in file:line), then the task's normal output.

## Failure modes
- Scanning the whole repository when the graph already answers the question.
- Treating INFERRED or STALE items as facts, or the graph as the source of truth.
- Ignoring recorded decisions because the code "looks" different, without saying so.
