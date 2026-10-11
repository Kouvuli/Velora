"""project-checks: run the project's own lint/format/typecheck/test/audit commands.

A "check" hook, unlike the guards: it executes the project's commands (from .ai/manifest.yaml `commands:`,
copied into .ai/hooks/config.json), so it is slow and is only active on the triggers listed in
config `checks.on` (default: pre-delivery; add `stop` to run them when the agent is about to finish). A failing command blocks; a timeout or a command that cannot
start is a warning. Output is trimmed to the last lines so the reason is visible.
"""
import json
import os
import subprocess

TRIGGERS = ("pre-delivery", "pre-commit", "stop")   # each only if listed in config `checks.on`
ORDER = ("lint", "format", "typecheck", "test", "audit")
TAIL = 15


def _config(root):
    try:
        with open(os.path.join(str(root), ".ai", "hooks", "config.json"), encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, ValueError):
        return {}


def _tail(text):
    lines = [ln for ln in (text or "").splitlines() if ln.strip()]
    return "\n      ".join(lines[-TAIL:])


def check(ctx):
    cfg = _config(ctx.root)
    checks = cfg.get("checks") or {}
    if ctx.trigger not in (checks.get("on") or ["pre-delivery"]):
        return []
    timeout = int(checks.get("timeout") or 900)
    commands = cfg.get("commands") or {}
    env = dict(os.environ, CI="1")  # non-interactive: test runners skip watch mode
    findings = []
    for kind in ORDER:
        cmd = commands.get(kind)
        if not cmd:
            continue
        try:
            r = subprocess.run(cmd, shell=True, cwd=str(ctx.root), env=env, capture_output=True, timeout=timeout)
        except subprocess.TimeoutExpired:
            findings.append(("warn", f"{kind}: `{cmd}` did not finish within {timeout}s"))
            continue
        except OSError as e:
            findings.append(("warn", f"{kind}: `{cmd}` could not start ({e})"))
            continue
        if r.returncode == 127:
            findings.append(("warn", f"{kind}: `{cmd}`: command not found (install it, or change/disable "
                                     f"`commands.{kind}` in .ai/manifest.yaml)"))
        elif r.returncode != 0:
            out = (r.stdout or b"").decode("utf-8", "replace") + (r.stderr or b"").decode("utf-8", "replace")
            findings.append(("block", f"{kind}: `{cmd}` failed (exit {r.returncode})\n      {_tail(out)}"))
    return findings
