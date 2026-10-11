"""dangerous-commands: stop destructive or unreviewable shell commands before an agent runs them.

`block` = never without a human typing it themselves; `warn` = the user must confirm
(in Claude Code this becomes a permission prompt). Matching is per command segment
(split on ; && || |), so `echo "git push --force"` inside quotes may still match:
false positives are preferred over silent damage here.
"""
import re

TRIGGERS = ("pre-tool:shell",)

PROTECTED = r"(main|master|production|prod|release)"

RULES = [
    ("block", re.compile(rf"\bgit\s+push\b(?=.*(\s--force(?!-with-lease)\b|\s-f\b|\s\+))(?=.*\b{PROTECTED}\b)"),
     "force-push to a protected branch"),
    ("warn", re.compile(r"\bgit\s+push\b.*(\s--force\b|\s--force-with-lease\b|\s-f\b)"), "force-push rewrites remote history"),
    ("block", re.compile(r"\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r|-r\s+-f|-f\s+-r)[a-zA-Z]*\s+"
                         r"(--no-preserve-root\s+)?(/|/\*|~|~/|\$HOME|\$HOME/|\*|\.\./?)(\s|$)"),
     "recursive delete of root, home, parent or everything in cwd"),
    ("block", re.compile(r"\b(curl|wget)\b[^|]*\|\s*(sudo\s+)?(ba|z|da)?sh\b"), "pipes downloaded content into a shell"),
    ("block", re.compile(r"\bterraform\s+(apply|destroy)\b.*-auto-approve"), "terraform apply/destroy without review"),
    ("warn", re.compile(r"\b(terraform|tofu)\s+(apply|destroy)\b"), "changes real infrastructure"),
    ("block", re.compile(r"\bmkfs(\.\w+)?\b|\bdd\s+.*\bof=/dev/"), "writes to a raw device"),
    ("warn", re.compile(r"\bgit\s+reset\s+--hard\b"), "discards uncommitted work"),
    ("warn", re.compile(r"\bgit\s+clean\s+-[a-zA-Z]*f"), "deletes untracked files"),
    ("warn", re.compile(r"\bgit\s+(checkout|restore)\s+(--\s+)?\.(\s|$)"), "discards all local changes"),
    ("block", re.compile(r"\bgit\s+(commit|push|merge|rebase|am|cherry-pick)\b.*\s--no-verify\b"),
     "bypasses git hooks (including these guards): fix what they report instead"),
    ("block", re.compile(r"\bgit\s+(-c\s+core\.hooksPath=\S+\s+)+(commit|push)\b|\bgit\s+config\b.*\bcore\.hooksPath\b"),
     "redirects git hooks away from the project's guards"),
    ("warn", re.compile(r"\bgit\s+commit\b.*\s-[a-zA-Z]*n[a-zA-Z]*(\s|$)"), "`-n` skips git hooks on commit"),
    ("warn", re.compile(r"(^|\s)(HUSKY=0|SKIP=\S+|PRE_COMMIT_ALLOW_NO_CONFIG=1)\s+\S*git\b"), "disables pre-commit hooks for this command"),
    ("warn", re.compile(r"\bgit\s+branch\s+-D\b"), "force-deletes a branch"),
    ("warn", re.compile(r"(?i)\b(drop\s+(database|schema|table)|truncate\s+table?)\b"), "destructive SQL"),
    ("warn", re.compile(r"\bkubectl\s+delete\b"), "deletes cluster resources"),
    ("warn", re.compile(r"\bdocker\s+(system\s+prune|volume\s+(rm|prune))\b"), "deletes Docker data volumes"),
    ("warn", re.compile(r"\bchmod\s+(-R\s+)?777\b"), "world-writable permissions"),
    ("warn", re.compile(r"\b(npm|yarn|pnpm)\s+publish\b|\btwine\s+upload\b|\bmvn\b.*\bdeploy\b"), "publishes a package"),
    ("warn", re.compile(r"(cat|less|more|head|tail|cp|scp)\s+[^|;&]*(~/\.aws/credentials|~/\.ssh/id_|\.env\b)"),
     "reads credentials"),
]


def check(ctx):
    out, seen = [], set()
    for seg in re.split(r"&&|\|\||;|\n", ctx.command or ""):
        seg = " " + seg.strip()
        for level, rx, why in RULES:  # ordered: a block ends the segment, so it is not also warned about
            if why not in seen and rx.search(seg):
                out.append((level, f"{why}: `{seg.strip()[:120]}`"))
                seen.add(why)
                if level == "block":
                    break
    return out
