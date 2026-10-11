---
name: retrospective
description: After a task went wrong or needed rework (wrong output, missed requirement, failed verification, user correction), finds the root cause, decides which layer failed - skill, knowledge, model choice, tool adapter, hook, requirement or project configuration - and records it with `ai-skills feedback` so repeated failures can be fixed in the right place. Use when a task failed, needed rework or was corrected by the user, or in a project retrospective.
license: MIT
---

# Retrospective

Outcome: every real failure is attributed to the layer that caused it, recorded once, and only repeated failures lead to changes, which are tested first.

## When
- Verification failed after you said a task was done, a reviewer found a blocker, or the user corrected your output.
- At the end of a milestone or engagement (with `client-status` / `handoff`).
Not for: an ordinary failing test during development. That is just `debugging`.

## Procedure
1. **What happened**: state the expected result, the actual result, and the evidence (command output, diff, user message). No blame, no speculation.
2. **Root cause**: ask "why" until you reach something that can be changed. Use the `debugging` skill's discipline: a cause is confirmed only by evidence.
3. **Layer**: pick the ONE layer that, if fixed, would have prevented it:
   - `missing-skill`: no skill covered this kind of task.
   - `bad-skill`: a skill was loaded and its procedure misled (name it).
   - `missing-knowledge` / `stale-knowledge`: a project fact was absent or out of date.
   - `wrong-model`: the task needed a stronger (or could use a cheaper) model tier.
   - `wrong-adapter`: the tool did not load the skill, hook or agent it should have.
   - `bad-hook`: a deterministic guard missed something or blocked wrongly.
   - `bad-requirement`: the requirement was ambiguous, contradictory or wrong.
   - `bad-config`: the project's manifest, lock or adapter choice was wrong.
4. **Record** it once:
   `ai-skills feedback record --layer <layer> --summary "<one generic sentence>" [--target <skill|hook|adapter>] [--tier <tier>]`
   Skill-OS layers are stored globally: write the summary **without client names, data or code**. Project layers are stored in the project's `.ai/knowledge/issues/`.
5. **Fix the instance now** in the project (the code, the knowledge item, the requirement) as usual.
6. **Do not edit the skill, router or hook yet.** A single failure is an anecdote. When `ai-skills feedback list` shows a repeated pattern, follow its next step: add a regression scenario (`ai-skills feedback scenario <id> ...`), change the layer, bump the version, test and evaluate, then `ai-skills feedback resolve`.

## Output
Five lines: what happened, root cause, layer, the feedback id or issue file, and what was fixed in the project.

## Failure modes
- Blaming the model for a missing requirement, or a skill for missing project knowledge.
- Rewriting a skill after one bad run.
- Copying client details into the global feedback log.
