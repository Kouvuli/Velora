# Interviewing for requirements

Adapted from Matt Pocock's `grilling` skill (mattpocock/skills, MIT, `../licenses/matt-pocock.LICENSE`), with the
questioning advice from Superpowers' `brainstorming` (obra/superpowers, MIT; ideas only), condensed and reworded.

## The decision tree
Every decision branches into the decisions that depend on it. The **frontier** is the set of questions whose
prerequisites are already settled: the ones you can ask now without guessing answers you have not heard. A
question whose answer depends on another question in the same round belongs to a later round.

## A round
Ask the whole frontier at once (cap it at about five; highest impact first), numbered, each with a recommended
answer the user can accept as-is:

```markdown
**Q1 - Refund window**: may customers cancel after the order has shipped?
  a) only before shipping  b) within 14 days of delivery  c) never
-> Recommended: a) - the code already blocks edits after `status=SHIPPED` (orders/service.py:88).

**Q2 - Partial cancellation**: ...
-> Recommended: ...
```

Wait for the answers, recompute the frontier, ask the next round.

## Facts versus decisions
- Facts are your job: anything in the code, config, data, docs or `.ai/knowledge/` you look up yourself (or
  delegate to a subagent) instead of asking. While a lookup runs, ask the frontier questions that do not depend on it.
- Decisions are the user's: put each one to them and wait; record the answer and who gave it.

## Done when
The frontier is empty: every branch visited, nothing silently assumed. Confirm the shared understanding before
anyone builds on it.

## Style
- Prefer multiple-choice questions; open questions only when the options are unknown.
- Superpowers asks one question per message, which suits a nervous or non-technical requester; rounds suit a user
  who wants fewer round-trips. Pick per user and say which.
- Check scope before detail: a request that is really several independent systems is split first.
