"""sensitive-files: block committing files that should never be in version control."""
import fnmatch
from pathlib import PurePosixPath

TRIGGERS = ("pre-commit", "pre-delivery")

BLOCK = {
    ".env": "environment file with secrets (commit a .env.example instead)",
    ".env.*": "environment file with secrets (commit a .env.example instead)",
    "*.pem": "private key / certificate",
    "*.key": "private key",
    "*.p12": "key store",
    "*.pfx": "key store",
    "*.jks": "Java key store",
    "id_rsa": "SSH private key",
    "id_dsa": "SSH private key",
    "id_ecdsa": "SSH private key",
    "id_ed25519": "SSH private key",
    "*.tfstate": "Terraform state (contains secrets; keep it in the remote backend)",
    "*.tfstate.backup": "Terraform state backup",
    ".git-credentials": "git credentials",
    ".pgpass": "Postgres password file",
}
WARN = {
    "*.tfvars": "Terraform variables often contain secrets; prefer a secret store",
    ".npmrc": "may contain a registry auth token",
    ".pypirc": "may contain a PyPI token",
    "credentials.json": "possible service-account credentials",
    "service-account*.json": "possible service-account credentials",
    "*.sqlite": "database file; usually not source",
    "*.dump": "database dump; may contain personal data",
}
ALLOWED = (".env.example", ".env.sample", ".env.template", ".env.dist", "*.pub")
BLOCK_DIRS = {".terraform": "Terraform working directory (providers, possibly state)"}


def _hit(name, table):
    for pat, why in table.items():
        if fnmatch.fnmatch(name, pat):
            return why
    return None


def check(ctx):
    out = []
    for rel in ctx.files:
        p = PurePosixPath(rel)
        if any(fnmatch.fnmatch(p.name, a) for a in ALLOWED):
            continue
        for part in p.parts[:-1]:
            if part in BLOCK_DIRS:
                out.append(("block", f"{rel}: {BLOCK_DIRS[part]}"))
                break
        else:
            why = _hit(p.name, BLOCK)
            if why:
                out.append(("block", f"{rel}: {why}"))
            else:
                why = _hit(p.name, WARN)
                if why:
                    out.append(("warn", f"{rel}: {why}"))
    return out
