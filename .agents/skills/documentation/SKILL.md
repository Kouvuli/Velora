---
name: documentation
description: Writes and updates developer and user documentation - README, setup and run instructions, API usage docs, runbooks, changelogs and code comments - accurate to the actual code and commands, aimed at a named reader, and kept short. Use when asked to document something, write or fix a README, explain how to run or use a system, or when a change makes existing docs wrong.
license: MIT
---

# Documentation

## Purpose
Docs that are correct, findable and short. Wrong docs are worse than none.

## When to use
- Writing or fixing a README, getting-started guide, API usage docs, runbook, troubleshooting guide, code comments; docs made stale by a change.

## When NOT to use
- Project knowledge for agents in `.ai/knowledge/`: `knowledge-update`.
- Architecture decisions: `architecture` (ADRs). Release notes for a release: `delivery`. Client handoff packs: `handoff`.

## Procedure
1. **Name the reader and their task** (new developer setting up, API consumer, on-call engineer, end user). Write only what that reader needs for that task.
2. **Derive every fact from the source**: commands from the build files and scripts, config from the config files, endpoints and fields from the code or contract. Run the commands you document when you can, and say which ones you could not run.
3. **Structure for scanning**: purpose in one or two sentences, prerequisites, steps as numbered commands, expected output, common errors and fixes. Examples over prose.
4. **Fit the existing docs**: update the document that already covers the topic instead of adding a parallel one; keep the project's tone and format; link instead of duplicating.
5. **Comments in code** explain *why* (constraints, surprising decisions), not *what* the next line does.
6. **Mark gaps**: if behaviour is unclear from the code, write it as an open question, not a guess.

## Output
The changed or new documents, and a list of statements you could not verify.

## Failure modes
- Documenting intended behaviour instead of actual behaviour; inventing flags, endpoints or env vars.
- Copy-pasting commands that were never run; stale version numbers.
- Long prose for every audience at once; duplicating content that then drifts.
