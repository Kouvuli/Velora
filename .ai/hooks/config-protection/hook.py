"""config-protection: stop an agent from making checks pass by weakening them.

Looks only at lines this change ADDS (the git diff), so existing project configuration is never flagged:
- block: a quality gate weakened in configuration - type checking relaxed, a lint rule switched off, CI steps
  allowed to fail, `|| true` after a check, a coverage threshold lowered;
- warn: blanket suppressions and skipped tests in source (`@ts-nocheck`, bare `# noqa` / `# type: ignore`,
  file-wide `eslint-disable`, `.skip(` / `@pytest.mark.skip`), which are sometimes legitimate.
A line containing `ai-skills: allow` is skipped. Outside a git repository there is no diff, so nothing is checked.
"""
import re
import subprocess

TRIGGERS = ("pre-commit", "post-edit", "stop")
ALLOW = "ai-skills: allow"

CONFIG = re.compile(
    r"(^|/)(\.eslintrc(\.\w+)?|eslint\.config\.\w+|tsconfig[\w.-]*\.json|jsconfig\.json|pyproject\.toml|setup\.cfg|"
    r"tox\.ini|\.flake8|\.?mypy\.ini|\.?ruff\.toml|pytest\.ini|\.coveragerc|codecov\.ya?ml|(jest|vitest|karma)\.conf(ig)?\.\w+|"
    r"\.golangci\.ya?ml|phpstan\.neon(\.dist)?|\.rubocop\.yml|biome\.jsonc?|package\.json|Makefile|build\.gradle(\.kts)?|"
    r"pom\.xml|\.pre-commit-config\.yaml|\.gitlab-ci\.yml|Jenkinsfile|azure-pipelines\.yml|\.github/workflows/[^/]+\.ya?ml)$")
CHECK_WORDS = r"(test|lint|eslint|ruff|flake8|mypy|pyright|tsc|typecheck|type-check|check|vet|clippy|pytest|jest|vitest|audit)"

CONFIG_RULES = [
    (re.compile(r'"(strict|noImplicitAny|strictNullChecks|noUnusedLocals|noUnusedParameters)"\s*:\s*false'),
     "relaxes TypeScript type checking"),
    # value is exactly "off" or the number 0 (so versions such as "0.1.0" are not lint rules)
    (re.compile(r"""["'][@\w/-]+["']\s*:\s*\[?\s*(["']off["']|0(?![\w.]))"""), "switches a lint rule off"),
    (re.compile(r"\b(ignore_errors|ignore_missing_imports)\s*=\s*true|\b(disallow_untyped_defs|check_untyped_defs|strict)\s*=\s*false"),
     "relaxes Python type checking"),
    (re.compile(r"\bcontinue-on-error\s*:\s*true|\ballow_failure\s*:\s*true"), "lets a CI step fail without failing the build"),
    (re.compile(rf"\b{CHECK_WORDS}\b[^\n#]*\|\|\s*(true|exit\s+0|:)\s*(['\"]?,?)?\s*$"), "ignores the exit code of a check (`|| true`)"),
    (re.compile(r"--passWithNoTests|--no-verify\b|-p\s+no:\w+|--continue-on-collection-errors"), "makes a check pass without checking"),
    (re.compile(r"\b(testPathIgnorePatterns|--deselect|--ignore=)\b|-k\s+['\"]?not\b"), "excludes tests from the run"),
]
THRESHOLD = re.compile(r"\b(fail_under|fail-under|cov-fail-under|coverageThreshold|minimum_coverage|branches|lines|statements|functions)\b\D{0,20}(\d+(\.\d+)?)")

SOURCE_RULES = [
    (re.compile(r"@ts-nocheck\b"), "turns off type checking for the whole file"),
    (re.compile(r"@ts-ignore\b"), "silences a type error (prefer fixing it, or @ts-expect-error with a reason)"),
    (re.compile(r"#\s*type:\s*ignore(?!\[)"), "blanket `# type: ignore` (name the error code, or fix it)"),
    (re.compile(r"#\s*noqa(?!:)\s*$"), "blanket `# noqa` (name the rule, or fix it)"),
    (re.compile(r"/\*\s*eslint-disable\s*\*/|//\s*eslint-disable\s*$"), "disables every lint rule in the file"),
    (re.compile(r"\b(it|test|describe)\.skip\(|\bx(it|describe|test)\(|@pytest\.mark\.skip\b|@unittest\.skip\b|@Disabled\b|\bt\.Skip\("),
     "skips a test"),
]


def _diff(ctx):
    args = ["git", "diff", "-U0", "--no-color", "--no-ext-diff"] + (["--cached"] if ctx.staged else ["HEAD"])
    try:
        r = subprocess.run(args + ["--"] + list(ctx.files), cwd=str(ctx.root), capture_output=True, timeout=30)
    except (OSError, subprocess.SubprocessError):
        return None
    if r.returncode != 0:
        return None
    return r.stdout.decode("utf-8", errors="replace")


def _changes(text):
    """{path: ([(line_no, added_text)], [removed_text])} from a -U0 diff."""
    out, path, line = {}, None, 0
    for raw in text.splitlines():
        if raw.startswith("+++ "):
            path = raw[6:] if raw.startswith("+++ b/") else None
            if path is not None:
                out.setdefault(path, ([], []))
        elif raw.startswith("@@"):
            m = re.search(r"\+(\d+)", raw)
            line = int(m.group(1)) if m else 0
        elif path is None or raw.startswith("--- "):
            continue
        elif raw.startswith("+"):
            out[path][0].append((line, raw[1:]))
            line += 1
        elif raw.startswith("-"):
            out[path][1].append(raw[1:])
    return out


def _untracked(ctx):
    try:
        r = subprocess.run(["git", "ls-files", "--others", "--exclude-standard", "--"] + list(ctx.files),
                           cwd=str(ctx.root), capture_output=True, timeout=30)
        return [f for f in r.stdout.decode("utf-8", "replace").splitlines() if f]
    except (OSError, subprocess.SubprocessError):
        return []


def check(ctx):
    if not ctx.files:
        return []
    text = _diff(ctx)
    if text is None:
        return []          # not a git repository (or no HEAD yet): nothing to compare against
    changes = _changes(text)
    if not ctx.staged:     # a new, untracked file is added in full
        for rel in _untracked(ctx):
            changes[rel] = ([(n, ln) for n, ln in enumerate(ctx.read(rel).splitlines(), 1)], [])
    out = []
    for path, (added, removed) in sorted(changes.items()):
        is_config = bool(CONFIG.search(path))
        for n, ln in added:
            if ALLOW in ln:
                continue
            for rx, why in (CONFIG_RULES if is_config else []):
                if rx.search(ln):
                    out.append(("block", f"{path}:{n}: {why}: `{ln.strip()[:100]}`"))
                    break
            for rx, why in SOURCE_RULES:
                if rx.search(ln):
                    out.append(("warn", f"{path}:{n}: {why}"))
                    break
        if is_config:
            before = {m.group(1): float(m.group(2)) for ln in removed for m in [THRESHOLD.search(ln)] if m}
            for n, ln in added:
                m = THRESHOLD.search(ln)
                if m and ALLOW not in ln and m.group(1) in before and float(m.group(2)) < before[m.group(1)]:
                    out.append(("block", f"{path}:{n}: lowers the {m.group(1)} threshold from "
                                         f"{before[m.group(1)]:g} to {m.group(2)}"))
    if any(level == "block" for level, _ in out):
        out.append(("block", "make the code pass the check instead; if the rule itself is wrong, change it in a "
                             "separate, explained commit the user approves (mark the line `ai-skills: allow`)"))
    return out
