"""dependency-lock: dependency manifests and their lockfiles change together."""
from pathlib import PurePosixPath

TRIGGERS = ("pre-commit", "pre-delivery")

# manifest -> lockfiles that pin it; `required` = a project of this kind should always have one
PAIRS = {
    "package.json": (("package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lock", "bun.lockb"), True),
    "go.mod": (("go.sum",), True),
    "composer.json": (("composer.lock",), True),
    "Gemfile": (("Gemfile.lock",), True),
    "Cargo.toml": (("Cargo.lock",), False),     # libraries often don't commit it
    "pyproject.toml": (("uv.lock", "poetry.lock", "pdm.lock"), False),
    "Pipfile": (("Pipfile.lock",), False),
}
# workspaces (npm/pnpm/yarn/bun, Cargo) keep ONE lockfile at the workspace root for every member manifest
WORKSPACE_LOCKS = {"package.json", "Cargo.toml"}


def _locks_for(ctx, p, locks):
    """Lockfiles that pin manifest p: beside it, or (workspace member) in the nearest ancestor that has one."""
    dirs = [p.parent] + (list(p.parent.parents) if p.name in WORKSPACE_LOCKS else [])
    for d in dirs:
        found = [str(d / lk) if str(d) != "." else lk for lk in locks]
        found = [s for s in found if (ctx.root / s).exists()]
        if found:
            return found
    return []


def check(ctx):
    files = set(ctx.files)
    findings = []
    for f in sorted(files):
        p = PurePosixPath(f)
        pair = PAIRS.get(p.name)
        if not pair:
            continue
        locks, required = pair
        if "node_modules" in p.parts or "vendor" in p.parts:
            continue
        existing = _locks_for(ctx, p, locks)
        if ctx.trigger == "pre-commit":
            if existing and not any(s in files for s in existing):
                findings.append(("warn", f"{f} changed but its lockfile ({', '.join(existing)}) is not in this "
                                         "commit; run the package manager's install and commit the lockfile"))
        elif required and not existing:
            findings.append(("warn", f"{f} has no lockfile ({' or '.join(locks)}); builds are not reproducible"))
    return findings
