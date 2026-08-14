# Deployment Guide (Vercel)

Deploys are **manual only** — by Vyden Co. maintainers. This checklist covers a full
(fresh or redeploy) setup on Vercel.

---

## 1. Link the project

Vercel → **Add New Project** → import `conflictsee-arch/conflictsee` → **Deploy**.

- Framework preset: **Next.js**
- Build command: `npm run build`
- Install command: `npm install`

## 2. Set environment variables

Vercel → project → **Settings → Environment Variables** — add every variable from
`.env.local`:

| Variable | Example |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://fxswdclbsngtydrcemeq.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your service_role key |
| `CRON_SECRET` | your cron secret |
| `GROQ_TIMELINE_KEY_1` | gsk_... |
| `GROQ_KEY_ORG_2` | gsk_... |
| `GROQ_KEY_ORG_3` | gsk_... |
| `GROQ_KEY_ORG_4` | gsk_... |
| `CURRENTS_KEY` | uidk... |
| `NEWSDATA_KEY` | your newsdata key |
| `GNEWS_KEY` | your gnews key |
| `ALPHAVANTAGE_KEY` | your alpha vantage key |
| `EXCHANGERATE_KEY` | your exchangerate key |
| `OILPRICE_KEY` | your oilprice key |
| `SENTRY_DSN` | your Sentry DSN |
| `NEXT_PUBLIC_SENTRY_DSN` | your Sentry DSN |
| `SENTRY_AUTH_TOKEN` | optional — Sentry source-map uploads |
| `SENTRY_TRACING` | `false` |

> **Production + Preview:** set these for both scopes so previews work too.
> ⚠️ Preview builds inherit env vars — see `ACCESS_SETUP.md` §4 for the quota risk.

## 3. Deploy

Vercel → **Deployments** → latest → **Redeploy** (or push to `main` → auto-deploys).

## 4. Verify scheduled ingestion (GitHub Actions, every 30 min)

Scheduled ingestion no longer lives in Vercel (Hobby plan allows only 1 cron run/day).
It runs as a **GitHub Actions workflow** (`.github/workflows/data-refresh.yml`) every
30 min, free on any plan. It calls these 4 production endpoints:

| Path | Schedule |
|---|---|
| `https://<project>.vercel.app/api/fetch-timeline` | `*/30 * * * *` |
| `https://<project>.vercel.app/api/process-news?type=economics` | `*/30 * * * *` |
| `https://<project>.vercel.app/api/process-news?type=world_affairs` | `*/30 * * * *` |
| `https://<project>.vercel.app/api/process-news?type=rumors` | `*/30 * * * *` |

- If the deployment URL differs from `conflictsee.vercel.app`, set a **repo variable**
  `PRODUCTION_URL` (GitHub → Settings → Secrets and variables → Actions → Variables).
- Verify runs on GitHub → **Actions** → **Data Refresh Cron** → each run shows 4
  successful steps. There's also a **Run workflow** button for manual triggers.
- The "Refresh" buttons on each page call the same routes manually — works without
  any cron.

## 5. Post-deploy smoke test

Open these and confirm no errors:

- [ ] `https://<project>.vercel.app/` — home renders
- [ ] `/timeline` — events load
- [ ] `/economics` — markets render
- [ ] `/world-affairs` — country stances
- [ ] `/rumors` — rumors feed
- [ ] Vercel → Functions → Logs — check structured log lines (`{"route":"...","event":"..."}`) appear without `"level":"error"`

## 6. Custom domain (optional)

Vercel → Settings → Domains → add `conflictsee.com` (or similar) → point DNS at
Vercel's `cname.vercel-dns.com`.
