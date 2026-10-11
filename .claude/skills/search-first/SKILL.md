---
name: search-first
description: Before writing new code, searches for what already exists and reuses it - helpers and patterns in this codebase, the project's existing dependencies, the language's standard library, and installed skills - and only adds new code or a new dependency when nothing fits, saying what was searched. Use before implementing a helper, utility, integration or feature that might already exist, and when the user asks to avoid duplication or reinventing the wheel.
license: MIT
---

# Search first

## Purpose
Reuse beats rewriting: one implementation of each rule, fewer dependencies, and code that looks like the rest of the project.

## When to use
- About to write a helper, formatter, validator, client, parser or rule; adding a dependency; "don't reinvent", "is there already something for this?".

## When NOT to use
- Choosing between genuinely different approaches: `brainstorm`. Cutting scope or abstraction: `simplicity-guard`.

## Procedure
1. **Name what you need** in two or three words and its likely names (e.g. "money rounding": round, cents, total, format_price).
2. **Search the codebase**: grep for those names and for the domain terms; check `.ai/knowledge/` and `ai-skills knowledge graph <name>`; look at how similar features were built (same layer, same module).
3. **Check what is already available**: the project's existing dependencies (package manifests), the standard library, the framework's built-ins, and the installed skills (`.agents/skills/`, `.claude/skills/`).
4. **Decide**: reuse as is; extend the existing code (keeping its tests green); or write new code only when nothing fits, and say why.
5. **New dependency?** Only with the user's agreement and after checking maintenance, license and size; prefer what the project already uses.
6. **Report what you searched** and what you reused, so reviewers can trust there is no duplicate.

## Output
A short "searched: <terms/places> -> found: <file:symbol> -> reused/extended/new because ..." note, then the change.

## Failure modes
- A second implementation of an existing rule (two VAT calculations that drift apart).
- Adding a library for something the standard library or an existing dependency already does.
- Claiming nothing exists without having searched.
