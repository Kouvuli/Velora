# Spec and ticket items in `.ai/knowledge`

The project's requirements live in its knowledge, so every skill, `ai-skills next`, the graph and
`ai-skills knowledge export` (the read-only view people use) see the same thing. `ai-skills knowledge check`
validates them; `ai-skills adopt` converts an existing project's specs and tickets into this shape.

## Feature: `.ai/knowledge/requirements/<ID>.md`

```markdown
---
id: ACME-BE-orders            # stable; equals the file name; prefix from manifest requirements.id_prefixes
kind: feature                 # feature | epic | reference (a pinned copy of another repo's item)
title: "Orders"
summary: "One line"
owner: acme-be                # the repo that owns it
lifecycle: draft              # draft | approved | superseded
revision: 1                   # +1 on any content change
approved_revision: null       # = revision once approved; reset to null by the next change
approval_evidence: null       # who approved, when, where ("user approved revision 2 in chat, 2026-09-10")
updated: "2026-10-07"
epic: ACME-EP-launch          # optional
related: []
status: CONFIRMED             # knowledge status: authored by people, so CONFIRMED without `evidence:`
---

# Orders

## Problem
## Scope
## Assumptions            (optional)
## User Stories
### US-01 — <user-visible outcome>
## Decisions and Contracts
## High-Level Design
## Low-Level Design
## Data Modelling         (optional)
## Acceptance Criteria
- AC-01 (US-01): Given <context>, when <action>, then <observable outcome>.
## Non-functional         (optional)
## Verification
## Dependencies
## Out of Scope
## Open Questions
## Revision History
- Revision 1: Initial draft; not approved.
```

Rules the checker enforces:
- Story IDs and criterion IDs are unique within the feature.
- Every criterion maps to an existing story.
- `approved` means `approved_revision == revision`, plus evidence.
- A draft keeps both approval fields null; keep the old approval in Revision History.
- A project may require more sections with manifest `requirements.required_sections`.

An epic uses `kind: epic`, lists `features: [...]` and has Outcome / Scope / Features / Success Measures. It never
approves its features' requirements.

## Ticket: `.ai/knowledge/work/<ticket-id>.md`

```markdown
---
id: ACME-BE-orders-T01        # <feature id>-T01, stable even after an external key arrives
title: "Place an order"
feature: ACME-BE-orders
feature_revision: 2           # the revision it was cut from; `ai-skills next` flags it when the spec moves on
stories: [US-01]
criteria: [AC-01, AC-03]
blocked_by: []                # other ticket ids
state: draft                  # draft | blocked | ready | in-progress | done
external_key: null            # e.g. a tracker key, only when verified
status: CONFIRMED
---

# Place an order

## Outcome
## Acceptance checklist
- [ ] AC-01 (US-01): ...
## Expected evidence
```

## Links from code

Name the IDs where the work happens, and the graph links code to requirements:
- In source: `ACME-BE-orders/AC-01` (or `ACME-BE-orders AC-01`) creates an `implements` edge.
- In tests: the same mention creates a `verifies` edge.
- Ticket IDs and external keys in code or tests link to the ticket.

`ai-skills knowledge graph ACME-BE-orders` then shows the stories, the criteria, the tickets covering them and the
code and tests that implement or verify them. `ai-skills next` reports the approved criteria that no test names.
