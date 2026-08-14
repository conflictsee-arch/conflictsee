# Security Policy

ConflictSee is maintained by **Vyden Co.** If you find a security vulnerability, **do not** open a public issue or PR with exploit details — report it privately.

## Reporting a vulnerability

Please send details to the security contact:

- **Email:** security@vyden.co.in
- **GitHub Security Advisory:** enabled on this repository (Settings → Security → Advisories)

### What to include

- Project name and version/commit you tested against
- A description of the vulnerability and its impact
- Steps to reproduce (minimal, no production data)
- (Optional) a suggested fix

### Response timeline

- We aim to acknowledge within **48 hours**.
- We'll work with you to confirm, fix, and release a patch.
- We'll credit you in the advisory unless you prefer to stay anonymous.

## Scope

In scope:

- The ConflictSee codebase (this repository)
- Configuration, secrets handling, and dependency usage

Out of scope:

- Third-party services (Supabase, Groq, Vercel, news/market APIs) — report those to their respective providers.

## Secrets & keys

**Never** commit real API keys. `.env.local` is gitignored; only `.env.example` (placeholders) lives in the repo. If you believe a key has leaked in history, **report it privately** and the maintainers will rotate it.

## Responsible disclosure

We follow coordinated disclosure: please give us a reasonable window to fix before publishing. We will never pursue legal action against researchers acting in good faith and following this policy.
