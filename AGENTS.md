# ConflictSee — Agent Instructions
Last updated: August 2026

> 📄 **Full project documentation for sharing with others lives in `DETAILS.md`** (architecture, pages, design system, API routes, schema, env vars, cron, workflow).
>
> 📄 **Public-facing docs** (for the open-source repo): `README.md` (overview + setup), `CONTRIBUTING.md` (contributor rules), `SECURITY.md` (vulnerability reporting), `ACCESS_SETUP.md` (maintainer-only GitHub/Vercel setup), `LICENSE` (MIT).

## Project
Real-time Iran-Israel war intelligence dashboard. 4 sections: Timeline, Economics, World Affairs, Rumors.

War started **Feb 28, 2026**. `WAR_START = new Date('2026-02-28T00:00:00Z')`. War day = `Math.floor((now - WAR_START) / 86400000) + 1`.

Tech stack: Next.js 14 (App Router) · Tailwind CSS · Supabase · Groq (AI ingestion) · Google Fonts

## Live URLs
- Production: https://conflictsee.vercel.app
- Supabase project: fxswdclbsngtydrcemeq

## Route Structure
```
/              → Home (Hero + StatsBar + 4 section cards)
/timeline      → Conflict Timeline (events table, TimelineSection.jsx)
/economics     → Economic Dashboard (prices + live markets)
/world-affairs → World Affairs (static COUNTRY_PROFILES + world_affairs table + world_affairs_news)
/rumors        → Rumors & Intel (rumors_news + legacy rumors)
```

## API Routes
| Route                      | Purpose                                                              |
|----------------------------|----------------------------------------------------------------------|
| `/api/fetch-timeline`      | Timeline ingestion: GDELT + Google News RSS + NewsData/GNews → Groq → events (GitHub Actions cron, 30min)     |
| `/api/fetch-news`          | Legacy generator for economics/world_affairs/rumors (CRON_SECRET)    |
| `/api/process-news`        | Per-section: `?type=economics|world_affairs|rumors` → `*_news` tables (NewsData `size=10` only — free tier rejects 20). Sources: Currents API (primary, realtime) + Google News RSS + NewsData `/latest` + GNews |
| `/api/seed-timeline`       | Gap-aware backfill: locked FULL_TIMELINE Feb28–Mar20 + chunked Groq for under-covered windows only. Params: `chunk` (days, default 7), `min` (per window, default 3). No destructive delete — purges placeholder titles only |
| `/api/backfill-news`       | Gap-aware backfill for `*_news`: skips well-covered ranges, purges placeholder titles, retries on rate limits. Params: `type`, `chunk` (default 7), `min` (default 2), `batch` (items per chunk, default 3, low for budget) |
| `/api/live-markets`        | Oil/commodities/forex/stock markets → market_cache (30min cache)     |

`vercel.json` crons were **removed** — scheduled ingestion runs via **GitHub Actions** (`.github/workflows/data-refresh.yml`): `/api/fetch-timeline` + 3× `/api/process-news?type=...` every 30 min, free on any Vercel plan (Hobby allows only 1 cron/day). Vercel deploys are manual; Actions is the scheduler.

## Fonts
- **Inter** = ALL text everywhere (headings, labels, descriptions, buttons, tags, nav links)
- **Space Mono** = numbers, prices, timestamps, coordinates ONLY — nothing else

In JSX, always apply:
```js
// Inter (default — applied via body)
style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}

// Space Mono (numbers/prices/times only)
style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}
```

## Colors (always use CSS variables — never hardcode)
| Token                 | Value     | Usage                        |
|-----------------------|-----------|------------------------------|
| `--accent-primary`    | #1a6b3c   | Primary green, featured cards|
| `--accent-light`      | #2d9e5f   | Hover states                 |
| `--accent-bright`     | #4caf7d   | Borders, accents             |
| `--accent-soft`       | #e8f5ee   | Light green backgrounds      |
| `--bg-page`           | #f0f2f5   | Page background              |
| `--bg-card`           | #ffffff   | Card backgrounds             |
| `--border`            | #e5e7eb   | Card borders                 |
| `--status-up`         | #2d9e5f   | Positive/up indicators       |
| `--status-down`       | #e53935   | Negative/down indicators     |
| `--status-warning`    | #f59e0b   | Warning states               |

## Design Rules
- White cards (`#ffffff`) always — no dark cards
- Light grey page background (`#f0f2f5`) always
- Dark green (`#1a6b3c`) as primary accent; red (`#dc2626`/`#e53935`) for rumors/unverified
- All **buttons**: `border-radius: 999px` (fully rounded)
- All **cards**: `border-radius: 16px`
- No dark backgrounds anywhere (except featured card in StatsBar)
- Mobile responsive on every component
- No hardcoded hex colors — always use CSS variables
- **NO inline `<style>` tags in JSX** — all CSS goes in `globals.css`
- **Mounted guard** required for ALL Date/time/pathname-dependent renders

## Hydration Rules (CRITICAL)
- Never use `if (!mounted) return null` — renders null on server, causes full hydration mismatch
- For time/date values: start with `useState('')` and set value inside `useEffect`
- For pathname-dependent classes: gate behind `mounted` state:
  ```js
  const isActive = mounted && pathname === link.href
  className={`nav-link ${isActive ? 'active' : ''}`}
  ```
- For framer-motion `whileHover`: never use `borderColor` — use `boxShadow` inset trick:
  ```js
  whileHover={{ boxShadow: '0 8px 24px rgba(0,0,0,0.10), inset 0 0 0 1px #4caf7d' }}
  ```

## Reusable CSS Classes
`.card` · `.card-featured` · `.btn-primary` · `.btn-secondary`
`.badge` + `.badge-military` `.badge-diplomatic` `.badge-economic` `.badge-humanitarian` `.badge-nuclear`
`.badge-verified` · `.badge-unconfirmed` · `.badge-monitoring` · `.badge-debunked`
`.skeleton` · `.section-header` · `.section-title` · `.section-subtitle` · `.pulse-dot` · `.mono`
`.nav-link` · `.statsbar-grid` · `.hero-container` · `.hero-btn-primary` · `.hero-btn-secondary`

## Supabase Tables
| Table                | Key columns                                                        |
|----------------------|--------------------------------------------------------------------|
| `events`             | id, timestamp_ist, headline, category, fact_check_status, published_at, verified, is_locked |
| `prices`             | id, asset_name, price, change_pct, currency, why_it_matters        |
| `countries`          | id, name, code, stance, impact_score, un_vote                      |
| `world_affairs`      | country, flag, stance, military_involvement, latest_statement, summary |
| `rumors`             | title, source_type, confidence, detail, region, first_seen, verified |
| `sources`            | id, name, tier, url                                                |
| `economics_news`     | title, summary, detail, category, severity, source, published_at, war_impact_note |
| `world_affairs_news` | title, summary, detail, category, severity, countries[], source, published_at |
| `rumors_news`        | title, summary, detail, category, severity, source, published_at, verified |
| `market_cache`       | id ('main'), data (jsonb), updated_at |

All tables have RLS enabled with public SELECT policy (`USING (true)`).

## Key Assignment (per-section budgets)
| Key env var            | Used by                                      |
|------------------------|----------------------------------------------|
| `GROQ_TIMELINE_KEY_1`  | Timeline (`fetch-timeline`, `seed-timeline`) |
| `GROQ_KEY_ORG_2`       | Economics (`process-news?type=economics`)    |
| `GROQ_KEY_ORG_3`       | World Affairs + Rumors (shared)              |
| `GROQ_KEY_ORG_4`       | Shared backup for ALL (used on 429)          |

## Data Pipeline Notes
- **NewsData free tier** returns content `"ONLY AVAILABLE IN PAID PLANS"` — process-news falls back to `description`. Also rejects `size=20` — always use `size=10`. Free tier data is ~12h delayed.
- **Currents API** (primary fresh source, `lib/currentsNews.js`): ~250 req/day free, real-time. 1 call per section per cron run. Parse `published` with `new Date(a.published)`.
- **Google News RSS** (`lib/googleNews.js`): free, no key, real-time headlines. Descriptions are source-link HTML only → `content` = title. Thin content is skipped by the timeline's 200-char gate.
- **GDELT** (`lib/gdeltNews.js`): free, unlimited, strict 1 req/5s rate limit (module self-throttles + returns `[]` on 429). Real article content — richest key-free source for the timeline.
- **GNews free tier** is rate-limited (100 req/day) and news is 12h delayed; paid tier for realtime.
- **Alpha Vantage** free tier: 25 req/day, 5/min — live-markets must not run too often.
- **Groq free tier**: 100K tokens/day **per organization** — all keys in the same org share one budget; rotation only helps across orgs. **Key pools** in `lib/groqClients.js` give each section its own key (separate budget) plus a shared backup:
  - `GROQ_TIMELINE_KEY_1` → timeline
  - `GROQ_KEY_ORG_2` → economics
  - `GROQ_KEY_ORG_3` → world_affairs + rumors
  - `GROQ_KEY_ORG_4` → shared backup for all (used on 429)
  Backfills must be gap-aware (see `/api/backfill-news` and `/api/seed-timeline`) and use low `batch`/`chunk` to stay within budget. When TPD is exhausted Groq returns `429 type:"tokens"` — retry after the window (error message shows `retry after`).
- **Model**: `groq/compound` everywhere. Groq **removed** `llama-3.3-70b-versatile` (returns `404 model_not_found` on all keys as of Aug 2026). Tested replacements: `groq/compound` extracts war events with clean JSON; `openai/gpt-oss-120b/20b` are too conservative (return `{"skip": true}` for legitimate war events); `qwen/qwen3.6-27b` emits thinking-trace text that breaks JSON parsing.
- **Article extraction** (`lib/articleExtractor.js`): fetches real bodies from article URLs to enrich thin feeds. Google News RSS links are `news.google.com` JS redirects — blocked (cannot resolve server-side). Currents/GNews/NewsData URLs resolve fine.
- `upsert(..., { onConflict: 'title' })` requires a unique constraint on `title` in each `*_news` table.

## Completed Features
- Hero section with live IST clock (mounted-guarded)
- StatsBar with animated counters (no inline styles)
- 4 pages: Timeline (server→client), Economics, World Affairs, Rumors (all client)
- World Affairs: static COUNTRY_PROFILES merged with live world_affairs table + news feed, stance-grouped layout
- Rumors: merged rumors_news + rumors, UNVERIFIED warning banner, category/severity filters, expandable cards
- Auto-refresh every 5 min + manual "Refresh Intel" buttons calling `/api/process-news`
- Backfilled timeline: Feb 28 → present (events), plus economics/world_affairs/rumors news feeds
- Active route highlighting in navbar (mounted-guarded)
- Loading spinners on all routes
- Favicon SVG + OG metadata
- Smooth scroll behavior

## Folder Structure
```
c:\code\Conflictsee\
├── app/
│   ├── api/
│   │   ├── fetch-news/        (route.js)
│   │   ├── fetch-timeline/    (route.js)
│   │   ├── live-markets/      (route.js)
│   │   ├── process-news/      (route.js)
│   │   └── seed-timeline/     (route.js + full-timeline-data.js)
│   ├── economics/     (page.js + loading.jsx)
│   ├── rumors/        (page.js + loading.jsx)
│   ├── timeline/      (page.js + loading.jsx)
│   ├── world-affairs/ (page.js + loading.jsx)
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── Navbar.jsx
│   ├── StatsBar.jsx
│   ├── HeroSection.jsx
│   ├── Footer.jsx
│   └── TimelineSection.jsx
├── lib/
│   ├── articleExtractor.js
│   ├── countryStances.js
│   ├── currentsNews.js
│   ├── gdeltNews.js
│   ├── googleNews.js
│   ├── groqClients.js
│   ├── rateLimit.js
│   ├── supabase.js
│   ├── timelineGroq.js
│   └── timelineNews.js
├── public/
│   └── favicon.svg
├── .env.local
├── AGENTS.md
└── package.json
```

## Removed Features
- NO credibility score 0–100%
- NO community voting
- NO upvote/downvote buttons
- NO Ask AI page or /api/ask endpoint
- Deleted dead code: `lib/apiClients.js`, `components/EconomicsSection.jsx`, `RumorsSection.jsx`, `WorldAffairsSection.jsx`

## Deployment Rules (CRITICAL)
1. **NEVER push to GitHub automatically.** Only push when explicitly commanded with "push to git" or "push to github".
2. **NEVER deploy to Vercel.** The user handles all deployments manually.
3. When commanded to push, exactly execute: `git add .`, `git commit -m "description"`, `git push`.
4. For all other tasks: make changes locally, run `npm run dev` to test, and wait for instructions.

## Monitoring
- **Sentry** wired in (`@sentry/nextjs`): `sentry.client.config.js`, `sentry.server.config.js`, `sentry.edge.config.js`, `instrumentation.ts`, `next.config.js` wrapped with `withSentryConfig`.
- DSN read from env (`SENTRY_DSN` / `NEXT_PUBLIC_SENTRY_DSN`); all `Sentry.init` calls gated behind `if (dsn)` so the build works without a DSN.
- Source-map uploads only happen when `SENTRY_AUTH_TOKEN` is set (optional). Errors report without it.
- Deprecation warnings (`disableLogger`, `sentry.client.config.js`) are cosmetic — fine to ignore on Next 14.1. `global-error.js` warning can be suppressed with `SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING=1`.
