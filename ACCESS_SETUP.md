# Access & Collaboration Setup (Vyden Co. / maintainers only)

> **This file is for the project maintainers.** It covers GitHub/Vercel dashboard actions that
> must be done by a human with Admin access. These are instructions — nothing here is automated.

**Public contact email:** conflictsee@gmail.com (suggestions, partnerships, security reports,
or building around the project).

---

## 1. Branch protection on `main`

Goal: enforce "changes go through review" mechanically, not just as a documented rule.

GitHub → repo → **Settings → Branches → Add rule** (or edit existing):

- [x] **Require a pull request before merging**
- [x] Require **1 approval**
- [x] **Dismiss stale reviews** when new commits are pushed
- [x] **Require status checks to pass before merging**
  - Add the CI check from the lint/build workflow (Phase 6) if it exists
- [x] **Do not allow bypassing the above settings** (forces even Maintainers through review)
- [ ] Do **NOT** enable "Allow force pushes" or "Allow deletions"

## 2. Collaborator roles

GitHub → repo → **Settings → Collaborators and teams**.

| Role | Capabilities | Recommended for |
|---|---|---|
| **Triage** | Label/close/assign issues & PRs, no write to code | Community helpers, QA testers |
| **Write** | Push branches, open PRs, approve reviews | Regular contributors |
| **Maintain** | Merge PRs, manage some settings | Senior contributors |
| **Admin** | Full control, incl. settings & collaborators | **Reserved for Vyden Co. leadership only** |

**Rule of thumb:** give people the *least* access they need. Most contributors should be `Write`
at most; the merge button belongs to `Maintain`+ and settings to `Admin`.

## 3. CODEOWNERS

Add a `CODEOWNERS` file at the repo root to route sensitive paths to specific reviewers:

```
# Sensitive paths — require a Vyden Co. maintainer review
/lib/groqClients.js          @conflictsee-arch/maintainers
/lib/timelineGroq.js         @conflictsee-arch/maintainers
/app/api/**                  @conflictsee-arch/maintainers
/.env.example                @conflictsee-arch/maintainers
/vercel.json                 @conflictsee-arch/maintainers

# UI-only changes can route elsewhere
/app/**/page.js
/components/**
```

GitHub enforces CODEOWNERS on every PR touching those paths (requires a codeowner approval).

## 4. Vercel preview deployments

Vercel → project → **Settings → Git → Deployment Protection**.

- **Enable preview deployments** per-PR (safe, isolated URLs).
- **WARNING:** preview builds inherit the project's env vars by default. An external PR that
  triggers ingestion routes could burn production Groq/news API quota.
- **Recommended:** restrict preview builds to **trusted collaborators only** (Vercel → Project →
  Settings → Git → "Only allow builds from..."), or
- **Alternative:** provision a separate, **lower-budget key set** (Groq/News/Currents) for previews
  and scope those env vars to preview deployments only.

## 5. CLA (business decision — flag, don't decide)

If Vyden Co. wants to retain clear rights over contributed code, a **Contributor License
Agreement** (e.g. via the CLA Assistant GitHub App) is the standard tool. This is a **business
decision** for whoever handles Vyden Co.'s legal side — it is **not** set up by default. Add it
only after a decision is made.

---

## How fork-and-PR contributions flow

1. A user forks the repo (GitHub gives them a full copy under their account — automatic, no permission needed).
2. They clone their fork, branch (`git checkout -b fix/timeline-badge`), change, test with `npm run dev`.
3. They push to their fork and open a PR back to `main` — your repo is only touched as a *proposal*.
4. Your CI workflow runs lint + build on the PR automatically; you see pass/fail before opening the diff.
5. You review, comment/request changes, and **click merge** when ready.

### What this means

- **You never grant fork-and-PR contributors any access** — anyone in the world can do this the moment the repo is public.
- **Their fork never touches your Vercel deployment or Supabase project** — they run against their own local env / their own keys, so your production keys and budget are safe. The only risk surface is Vercel preview deployments (§4), which is a separate, opt-in thing.
