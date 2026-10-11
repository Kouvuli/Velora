"""secret-scan: block credentials before they are committed or written by an agent.

High-confidence token formats block; generic `password = "..."` assignments only warn.
A line containing `ai-skills: allow` is skipped (for documented test fixtures).
"""
import re

TRIGGERS = ("pre-commit", "post-edit", "pre-delivery")

BLOCK = [
    ("AWS access key id", re.compile(r"\b(AKIA|ASIA)[0-9A-Z]{16}\b")),
    ("private key", re.compile(r"-----BEGIN (RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY( BLOCK)?-----")),
    ("GitHub token", re.compile(r"\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{22,})\b")),
    ("GitLab token", re.compile(r"\bglpat-[A-Za-z0-9_-]{20,}\b")),
    ("Slack token", re.compile(r"\bxox[abprs]-[A-Za-z0-9-]{10,}\b")),
    ("Stripe live key", re.compile(r"\b[rs]k_live_[A-Za-z0-9]{16,}\b")),
    ("Google API key", re.compile(r"\bAIza[0-9A-Za-z_-]{35}\b")),
    ("Anthropic API key", re.compile(r"\bsk-ant-[A-Za-z0-9_-]{20,}")),
    ("OpenAI API key", re.compile(r"\bsk-(proj|svcacct|admin)-[A-Za-z0-9_-]{20,}")),
    ("credentials in URL", re.compile(r"\b[a-z][a-z0-9+.-]*://[^/\s:@'\"]+:[^/\s@'\"$]{6,}@[\w.-]+")),
]
WARN = re.compile(r"(?i)([\w.-]*(password|passwd|pwd|secret|api[_-]?key|access[_-]?token|auth[_-]?token)[\w-]*)"
                  r"['\"]?\s*[:=]\s*['\"]([^'\"\s]{8,})['\"]")
PLACEHOLDER = re.compile(r"(?i)(example|changeme|change-me|placeholder|dummy|sample|your[_-]|xxx|\*\*\*|<|\$\{|\{\{|redacted|test)")
KNOWN_FAKE = {"AKIAIOSFODNN7EXAMPLE"}  # AWS's documented example key


def check(ctx):
    out = []
    for rel in ctx.files:
        text = ctx.read(rel)
        if not text:
            continue
        for n, line in enumerate(text.splitlines(), 1):
            if "ai-skills: allow" in line:
                continue
            for label, rx in BLOCK:
                m = rx.search(line)
                if m and m.group(0) not in KNOWN_FAKE:
                    out.append(("block", f"{rel}:{n}: {label} ({m.group(0)[:8]}...)"))
                    break
            else:
                m = WARN.search(line)
                if m and not PLACEHOLDER.search(m.group(3)):
                    out.append(("warn", f"{rel}:{n}: possible hard-coded {m.group(1)}; use env/secret store"))
    return out
