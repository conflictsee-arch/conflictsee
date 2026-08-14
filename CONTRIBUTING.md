# Contributing to ConflictSee

Thanks for your interest! ConflictSee is an open-source real-time war intelligence dashboard built and maintained by [Vyden Co.](https://vyden.co.in).

Questions, suggestions, or ideas to build around ConflictSee? Email us at **conflictsee@gmail.com**.

This guide translates the project's internal rules (see `AGENTS.md`) into human-readable contributor guidelines.

## Table of Contents

1. [Development setup](#development-setup)
2. [How to contribute (branching & PRs)](#how-to-contribute)
3. [Design system rules](#design-system-rules)
4. [Hydration rules](#hydration-rules)
5. [API keys & budgets](#api-keys--budgets)
6. [Deployment policy](#deployment-policy)
7. [Code style](#code-style)

## Development setup

```bash
git clone https://github.com/conflictsee-arch/conflictsee.git
cd conflictsee
npm install
cp .env.example .env.local   # fill in keys
npm run dev
```

You'll need a Supabase project and free-tier API keys (see the [README](README.md#required-api-keys-free-tier)). No key, no problem — the app degrades gracefully (loading states, empty feeds).

## How to contribute

1. **Fork** the repo to your account.
2. **Create a branch** with a descriptive name:
   - `fix/...` for bug fixes — e.g. `fix/timeline-badge-sort`
   - `feat/...` for new features — e.g. `feat/mock-data-mode`
   - `chore/...` for maintenance — e.g. `chore/update-deps`
3. Make your changes, run `npm run lint`, and test locally with `npm run dev`.
4. **Push to your fork** and open a Pull Request to `main`.
5. In the PR description, briefly explain **what** you changed and **why**.

**Branch naming examples:**

```
fix/timeline-badge-sort
feat/mock-data-mode
chore/update-deps
```

Your PR will be reviewed before merging. Nothing lands in `main` without a review.

## Design system rules

These are **mandatory** — the visual identity depends on them:

| Rule | Value |
|---|---|
| Colors | **CSS variables only** — never hardcode hex in components. Use tokens from `app/globals.css` (e.g. `var(--accent-primary)`, `var(--status-up)`). |
| Inline styles | **No inline `<style>` tags in JSX** — all CSS goes in `globals.css`. |
| Buttons | `border-radius: 999px` (fully rounded) |
| Cards | `border-radius: 16px` |
| Fonts | **Inter** for ALL text; **Space Mono** for numbers/prices/times ONLY |
| Cards | White (`#ffffff`) on light grey page background (`#f0f2f5`) — no dark cards |
| Reuse | Use shared classes: `.card`, `.btn-primary`, `.badge-*`, `.nav-link`, `.mono`, etc. |

## Hydration rules

Next.js SSR + client-side time/date renders must not mismatch:

- **Never** use `if (!mounted) return null` — this renders null on the server and causes a full hydration mismatch.
- For **time/date values**: start with `useState('')` and set the value inside `useEffect`.
- For **pathname-dependent classes**: gate behind a `mounted` state:
  ```js
  const isActive = mounted && pathname === link.href
  className={`nav-link ${isActive ? 'active' : ''}`}
  ```
- For **framer-motion `whileHover`**: never use `borderColor` — use the `boxShadow` inset trick.

## API keys & budgets

All third-party keys are **free-tier** and rate-limited. **Never commit real keys** — `.env.local` is gitignored; only `.env.example` (with placeholders) goes in the repo.

Key assignment and per-section budgets are documented in `AGENTS.md` (key-pool table). If a new feature needs a key or an existing one needs re-budgeting, **open an issue** and the maintainers will handle it — don't generate or share new keys yourself.

**Ingestion rules:**
- Keep backfill `batch`/`chunk` parameters low to stay within Groq's daily token budget.
- `news.google.com` links are JS redirects and cannot be fetched server-side — skip them.
- Never switch the timeline model from `llama-3.3-70b-versatile` — other models have been tested and are too conservative.

## Deployment policy

**Deploys are manual only.** This is enforced at the repo level:

- **Never** wire up auto-deploy or auto-push in CI configuration.
- **Never** push to `main` directly — changes land only via reviewed PRs.
- The maintainers (Vyden Co.) handle all Vercel deployments manually.

If you see a workflow, action, or CI config that would auto-deploy or auto-push, **flag it immediately**.

## Code style

- No comments unless they clarify non-obvious logic.
- Follow the existing patterns in neighboring files.
- Run `npm run lint` before pushing — it must pass with zero warnings.