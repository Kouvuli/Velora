---
name: next-step
description: Tells the user where they are in the work and which installed skill to use next, with the reason and a ready-to-paste prompt - from the project state (tickets, specs, git, knowledge via `ai-skills next`), the project's skill map and what this conversation has already done. Use when the user asks "what next?", "which skill now?", invokes next-step, starts a new session on a ticket, finishes a step, or seems stuck between steps.
license: MIT
---

# Next step

## Purpose
Turn "what do I do now?" into one concrete move: the current stage, the next skill (`$name`), why, and the exact
words to start it. It also teaches the skill set: the user learns the flow by being shown it one step at a time.

## When to use
- "What next?", "which skill should I use?", "$next-step", "where was I?".
- The start of a new chat on a ticket or feature.
- Right after another skill produced its output (a spec, a plan, green tests, a verification table).
- The user is unsure, or the conversation drifted between steps.

## When NOT to use
- The user already named the skill to run: run that skill.
- Answering what a skill does in detail: read that skill's SKILL.md instead.
- Doing the next step itself: this skill only recommends. Start the next skill when the user says go.

## Procedure
1. **Read the project state** (cheap first):
   - Run `ai-skills next --json`: merge in progress, invalid items, uncommitted changes, ready/stale/draft tickets,
     criteria in no ticket or with no test.
   - If the CLI is missing, read `.ai/knowledge/work/*.md` (`state`, `blocked_by`) and
     `.ai/knowledge/requirements/*.md` (`lifecycle`, `revision`), plus `git status`.
2. **Read the skill map** `.ai/knowledge/index/skill-map.yaml`. Its stages, situations and `next` are the skills
   installed here; project skills there (e.g. a project's own to-spec) replace the generic ones. Never recommend
   a skill that is not installed (the managed block in AGENTS.md / CLAUDE.md lists them).
3. **Read this conversation**: which skill ran last, and did it finish? Look for evidence, not intent: a spec item
   written, an approved revision, a plan agreed, a red test that went green, a verification table with every
   criterion, a review with findings resolved.
4. **Place the work in a stage** with the ticket flow in
   [references/ticket-flow.md](references/ticket-flow.md): orient → shape → plan → build → check → ship. The first
   unmet gate wins. A blocker always comes first (merge in progress, failing build, invalid item, unclear
   criterion).
5. **Recommend** one next skill. Give at most two alternatives, each with when it would be better. Use the map's
   `next` for the "then" line.

## Output
```markdown
**You are at:** <stage> - <the evidence: e.g. "DU-FE-marketplace-launch-T03 is ready; nothing built yet">
**Next:** `$<skill>` - <why, one line>
> <a prompt the user can paste, e.g. "$tdd DU-FE-marketplace-launch-T03: start with AC-01">
**Then:** `$<skill>` → `$<skill>`
**Or:** `$<skill>` if <condition>   (0-2 lines)
```
Keep it short. Say what was NOT checked (e.g. "CLI not available; read the ticket files instead").

## Failure modes
- Recommending from habit instead of state: a "ready" ticket with a draft spec is not ready.
- Skipping a gate because the user is in a hurry: no `delivery` before `verification`, no code before the
  criteria are clear.
- Listing every skill: one next step, at most two alternatives.
- Naming a generic skill when the project has its own (to-spec / to-ticket): the skill map says which.
- Starting the next skill without being asked.
