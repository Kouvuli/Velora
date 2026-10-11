# Tracer-bullet tickets for work bigger than one session

Adapted from Matt Pocock's `to-tickets` skill (mattpocock/skills, MIT, `../licenses/matt-pocock.LICENSE`),
condensed and reworded.

## Slices
- Each ticket cuts a narrow but **complete** path through every layer it needs (schema, API, UI, tests): a
  vertical slice, not one layer.
- A finished ticket is demoable or verifiable on its own.
- Each fits in one fresh agent session.
- Prefactoring tickets come first: make the change easy, then make the easy change.
- Use the project's domain vocabulary (glossary, ADRs) in titles and descriptions.

## Blocking edges
Every ticket names the tickets that must finish before it can start ("None" if it can start now). Work the
**frontier**: any ticket whose blockers are done. Edges must be real gates, not "nice to do first".

## Wide refactors: expand, migrate, contract
A mechanical change with a huge blast radius (rename a column, retype a shared symbol) cannot land as a green
vertical slice. Sequence it instead:
1. **Expand**: add the new form beside the old one; nothing breaks.
2. **Migrate** call sites in batches sized by blast radius (per package or directory), each batch its own ticket
   blocked by the expand, CI green after each because the old form still exists.
3. **Contract**: remove the old form once no caller remains, blocked by every migrate batch.

## Agree the breakdown
Show the numbered list (title, blocked by, what it delivers) and ask: is the granularity right, are the edges
right, should anything be merged or split? Iterate before writing tickets anywhere.

## Ticket template
```markdown
# 03: <title>
What to build: <the end-to-end behaviour from the user's point of view, not a layer-by-layer list>
Blocked by: 01, 02   (or: None - can start immediately)
- [ ] <acceptance criterion>
- [ ] <acceptance criterion>
```
Avoid file paths and code in tickets (they go stale); inline a snippet only when it encodes a decision more
precisely than prose (a state machine, a schema, a type shape).

Tickets live as `.ai/knowledge/work/<feature ID>-T01.md` items (format in the `requirements` skill's
`references/spec-item.md`): `feature`, `feature_revision`, `stories`, `criteria`, `blocked_by`, `state`. Every
approved criterion is covered by at least one ticket; `ai-skills knowledge check` validates the IDs and
`ai-skills next` shows what is ready, stale or uncovered. A tracker (Jira, Trello, GitHub) is a mirror: keep its key
in `external_key` and its ids under `tracker:`.
