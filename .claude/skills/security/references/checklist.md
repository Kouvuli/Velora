# Security checklist (OWASP Top 10 oriented)

## Access control
- [ ] Authorization checked server-side on every request, per resource/object
- [ ] Deny by default; admin functions separated and protected
- [ ] No sensitive identifiers trusted from the client without ownership checks (IDOR)
- [ ] CORS restricted to known origins; no wildcard with credentials

## Cryptography and secrets
- [ ] TLS everywhere; no custom crypto
- [ ] Passwords hashed with a slow, salted algorithm (bcrypt/scrypt/Argon2)
- [ ] Secrets loaded at runtime from a secret store or environment; not committed, not logged
- [ ] Tokens have expiry, are validated (signature, audience, issuer), and can be revoked

## Injection
- [ ] Parameterized queries / ORM bindings for every query
- [ ] No shell invocation with user input; if unavoidable, argument arrays, never string concatenation
- [ ] File paths built from user input are normalized and confined to an allowed base directory
- [ ] Templates auto-escape; any raw HTML is sanitized

## Design and configuration
- [ ] Rate limiting / lockout on auth and expensive endpoints
- [ ] Security headers (CSP, HSTS, X-Content-Type-Options, frame-ancestors)
- [ ] Debug endpoints, stack traces and default credentials disabled in production
- [ ] Least-privilege service accounts and database users

## Components
- [ ] Dependencies pinned (lockfile) and audited; no abandoned packages for security-relevant work
- [ ] Container images from trusted bases, non-root user

## Identification and sessions
- [ ] Session IDs rotated on login; secure, HttpOnly, SameSite cookies
- [ ] MFA available for privileged accounts where the product supports it

## Integrity
- [ ] No unsafe deserialization of untrusted data
- [ ] Webhooks and callbacks verify signatures
- [ ] CI/CD secrets scoped; third-party actions pinned to a commit

## Logging and monitoring
- [ ] Security-relevant events logged (login, permission denied, admin actions) without secrets or personal data

## Server-side request forgery
- [ ] Outbound requests to user-supplied URLs use an allow-list; block internal address ranges and metadata endpoints
