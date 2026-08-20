# ConflictSee — Project Details & Full Documentation

**Live URL:** https://conflictsee.vercel.app
**Type:** Real-time Iran–Israel war intelligence dashboard
**Stack:** Next.js 14 (App Router) · Tailwind CSS · Supabase (Postgres + RLS) · Groq (AI ingestion) · Google Fonts
**War reference date:** War started **Feb 28, 2026**. `WAR_START = new Date('2026-02-28T00:00:00Z')`. War day = `Math.floor((now - WAR_START) / 86400000) + 1`.

---

## 1. What the Project Does

ConflictSee aggregates live news, market prices, and diplomatic/intel data about the Iran–Israel–US war into **4 intelligence sections** on a single dashboard:

1. **Timeline** (`/timeline`) — chronological log of war events, each with bullets/detail, category, severity, source.
2. **Economics** (`/economics`) — oil/commodity prices, global stock indices, forex currency heatmap, and war-economics news.
3. **World Affairs** (`/world-affairs`) — country-by-country stances (alignment + intensity), a world stance map, and geopolitical news.
4. **Rumors & Intel** (`/rumors`) — unverified/OSINT claims, always labeled `UNVERIFIED`, with severity and category filters.

All data is fetched and **AI-processed by Groq** (`groq/compound`) into structured JSON, then stored in Supabase. Pages are client components that read directly from Supabase and auto-refresh every 5 minutes. GitHub Actions re-ingests every 30 minutes (free on any Vercel plan — Hobby allows only 1 Vercel cron/day).

---

## 2. Tech Stack (exact versions)

| Layer | Technology |
|---|---|
| Framework | Next.js **14.1.0** (App Router) |
| UI | React 18, Tailwind CSS 3.3 |
| Animation | framer-motion 12 |
| Icons | lucide-react |
| Charts | chart.js 4 + react-chartjs-2 |
| Fonts | Inter (all text), Space Mono (numbers/prices/times) via next/font |
| Database | Supabase (Postgres, RLS enabled, public SELECT) |
| AI ingestion | Groq API (`groq-sdk`) — model `groq/compound` |
| Maps | `@svg-maps/world` |
| Scheduling | GitHub Actions cron (`.github/workflows/data-refresh.yml`, every 30 min) |
| Deployment | Vercel (free plan) — **the user deploys manually, never auto-push** |

---

## 3. Project Structure (folder tree)

```
conflictsee/
├── app/
│   ├── api/
│   │   ├── backfill-news/     route.js      → gap-aware backfill for *_news tables
│   │   ├── fetch-news/        route.js      → LEGACY generator (economics/world_affairs/rumors, CRON_SECRET)
│   │   ├── fetch-timeline/    route.js      → timeline ingestion (GitHub Actions cron, 30min)
│   │   ├── live-markets/      route.js      → oil/commodities/markets/forex → market_cache (30min cache)
│   │   ├── process-news/      route.js      → per-section: ?type=economics|world_affairs|rumors
│   │   └── seed-timeline/     route.js      → gap-aware backfill (Feb 28–Mar 20 locked + Groq windows)
│   │                            full-timeline-data.js → locked historical timeline (Feb 28 – Mar 20)
│   ├── economics/             page.js + loading.jsx   → 4 tabs: Energy, Markets, Currencies, News
│   ├── rumors/                page.js + loading.jsx   → merged rumors_news + legacy rumors
│   ├── timeline/              page.js + loading.jsx   → TimelineSection (server→client)
│   ├── world-affairs/         page.js + loading.jsx   → COUNTRY_PROFILES + world_affairs table + news
│   ├── globals.css            → all CSS (design tokens, no inline <style> tags)
│   ├── layout.js              → fonts, metadata, OG
│   └── page.js                → home (Hero + StatsBar + 4 section cards)
├── components/
│   ├── Navbar.jsx             → sticky nav + conflict banner + mobile overlay
│   ├── HeroSection.jsx        → hero with live IST clock + stat card
│   ├── StatsBar.jsx           → animated counters (4 stat cards)
│   ├── Footer.jsx             → footer + live market strip
│   ├── TimelineSection.jsx    → main timeline component
│   ├── WorldStanceMap.jsx     → world map colored by country stance
│   └── skeletons/             (placeholder dir)
├── lib/
│   ├── articleExtractor.js    → fetches real article bodies to enrich thin feeds
│   ├── countryStances.js      → static COUNTRY_STANCES (330 lines, all countries)
│   ├── currentsNews.js        → Currents API fetcher (realtime, ~250 req/day)
│   ├── gdeltNews.js           → GDELT DOC 2.0 fetcher (key-free, 1 req/5s)
│   ├── googleNews.js          → Google News RSS parser (key-free, realtime)
│   ├── groqClients.js         → per-section Groq key pools + model selection
│   ├── rateLimit.js           → in-memory per-IP rate limiter
│   ├── supabase.js            → Supabase client (anon key)
│   ├── timelineGroq.js        → timeline system prompt + Groq message helper
│   └── timelineNews.js        → multi-source feed assembly for the timeline
├── public/
│   └── favicon.svg
├── .env.local                 → all secrets (gitignored)
├── .env.example               → template with placeholders
├── AGENTS.md                  → agent instructions (key budgets, rules, routes)
├── DETAILS.md                 → THIS FILE
├── vercel.json                → Vercel framework config (no crons — they live in GitHub Actions)
└── package.json
```

---

## 4. Pages & Layout Format

### Global layout (`app/layout.js`)
- Google Fonts **Inter** + **Space Mono** loaded via next/font with CSS variables `--font-inter` and `--font-space-mono`.
- Body always `font-family: var(--font-inter), Inter, sans-serif`.
- Metadata: title `ConflictSee`, description, `metadataBase: https://conflictsee.vercel.app`, favicon, OpenGraph.

### Home (`/`)
- `Navbar` → `HeroSection` → `StatsBar` → **4 section cards** (Timeline / Economics / World Affairs / Rumors) → `Footer`.
- Cards are white (`#ffffff`), 20px radius, icon in green soft tile, hover lift.
- Page background: `--bg-page` (`#f0f2f5`).

### Navbar (all pages)
- Sticky, 64px, transparent→white blur on scroll.
- Left: "CS" logo tile + **ConflictSee**.
- Center: 4 nav links with active underline.
- Right: red `LIVE` pulse dot + `DAY {n}` green pill + mobile hamburger.
- Below navbar: **conflict banner** (36px, green) — `CONFLICT ACTIVE — DAY {n} | Iran-Israel War | Last Updated {time} IST | Auto-refresh: ON`.

### HeroSection
- Left (60%): green pill `🔴 LIVE COVERAGE — DAY {n}`, H1 "Iran-Israel War Intelligence Hub.", sub-headline, two buttons (`View Live Timeline` green, `Economic Dashboard` outline).
- Right (40%): white stat card — `Live Intelligence Feed` + 4 rows: **Conflict Day**, **Events Logged**, **Countries Watch**, **Active Rumors** — with Space Mono numbers + live IST clock (mounted-guarded).

### StatsBar
- 4 cards, the first one **dark green featured** (`#1a6b3c`), others white. Animated counters (1.5s easeOut). Labels: `TOTAL EVENTS`, `COUNTRIES AFFECTED`, `MARKETS IMPACTED`, `ACTIVE RUMORS`.

### Section pages (all client components, `'use client'`)
Each page: `Navbar` → header → content → `Footer`. Common patterns:
- **Mounted guard** on all time/date/pathname-dependent renders.
- **Skeleton cards** while loading.
- **5-min auto-refresh** (`setInterval(loadData, 300000)`) + manual `Fetch Latest` / `Refresh Intel` button.
- **Filters** (category/severity pills, pill = fully-rounded buttons).
- **Expandable cards** — click to reveal detail + related info.
- Time display uses `timeAgo()` (Xm ago / Xh ago / Xd ago) in Space Mono.

---

## 5. Section-by-Section Format

### Timeline (`/timeline`)
- Server component page → renders client `TimelineSection`.
- Vertical timeline: left date column, dot, card.
- Each event card: category badge, severity badge, title, `context_header`, bullets (summary + expandable detail), source, source URL, time in Space Mono.
- Events read from Supabase `events` table (parsed `description` JSON payload), grouped by **war day** (`DAY {n}` connectors), timezone-aware.
- `is_locked` events (Feb 28 – Mar 20, from `full-timeline-data.js`) are shown but never regenerated.

### Economics (`/economics`)
- **4 tabs** (buttons):
  1. **Energy & Commodities** — grid of 10 cards (Brent, WTI, Natural Gas, Heating Oil, RBOB, Gold, Silver, Platinum, Copper, Uranium), each with price (Space Mono, `$` format), change indicator (▲/▼ green/red), "why it matters" note, and click-to-expand price history chart.
  2. **Global Markets** — region-grouped rows (Asia-Pacific / Europe / Americas), 18 indices (Sensex, Nifty, Nikkei, S&P 500, Dow, DAX, FTSE…), each with flag, sparkline, close price, change %. Click to expand history chart.
  3. **Currencies** — **Currency Heatmap** (auto-fill grid, green = strengthening vs USD, red = weakening) + 5 grouped cards: *Under War Pressure, War Safe Havens, Global Majors, Gulf & Asia Region, Frontier & EM* (~46 pairs).
  4. **News** — economics_news articles: severity/category pills, title, summary, expand for detail + **Related War Event** (nearest event within ±24h) + **War Impact** box. Category filter pills.
- Data source: `/api/live-markets` → `market_cache` (30-min cache, shows "Cached data — refreshed X min ago").

### World Affairs (`/world-affairs`)
- Static `COUNTRY_STANCES` (from `lib/countryStances.js`, ~all UN countries) merged with live `world_affairs` table.
- **WorldStanceMap** (`@svg-maps/world`) colored by stance.
- Countries grouped by stance (At War / Pro-Israel / Pro-Palestine / Pro-Iran / Neutral), each card: flag, name, alignment, intensity, summary.
- News feed (`world_affairs_news`): category filter pills (Great Power Politics, NATO-Europe, Diplomacy, Humanitarian, Lebanon, Regional Actors, South Asia, Islamic World), expandable cards with `countries[]`.

### Rumors (`/rumors`)
- Merges `rumors_news` (fresh, AI-extracted) + legacy `rumors` table (normalized).
- **UNVERIFIED warning banner** at top.
- Filters: category (Intelligence, Nuclear, Leadership, Military, Diplomatic, Atrocity Claims) + severity (High/Medium/Low).
- Cards: `UNVERIFIED:` prefix on title, severity pill, summary, expand for detail, source type (`Telegram/OSINT`, etc.), `verified: false` always.

---

## 6. Design System (from `app/globals.css`)

### Color tokens (always CSS variables — never hardcode hex in components)
| Token | Value | Usage |
|---|---|---|
| `--accent-primary` | `#1a6b3c` | primary green, featured cards |
| `--accent-light` | `#2d9e5f` | hover states |
| `--accent-bright` | `#4caf7d` | borders, accents |
| `--accent-soft` | `#e8f5ee` | light green backgrounds |
| `--bg-page` | `#f0f2f5` | page background |
| `--bg-card` | `#ffffff` | card background |
| `--border` | `#e5e7eb` | card borders |
| `--status-up` | `#2d9e5f` | positive/up |
| `--status-down` | `#e53935` | negative/down |
| `--status-warning` | `#f59e0b` | warning |

### Design rules
- White cards always; light grey page always; no dark cards except StatsBar featured.
- Buttons: `border-radius: 999px`. Cards: `border-radius: 16px`.
- **Fonts:** Inter = ALL text; Space Mono = numbers/prices/timestamps/coordinates ONLY.
- Mobile responsive everywhere (grids collapse 4→2→1).
- No inline `<style>` tags — all CSS in `globals.css`.
- Hydration-safe: all time/date/pathname renders behind `mounted` state (never `return null` server-side).

### Reusable CSS classes
`.card` `.card-featured` `.btn-primary` `.btn-secondary` `.badge` + `.badge-{category}` (military/diplomatic/economic/humanitarian/nuclear/political/news) + `.badge-{status}` (verified/unconfirmed/monitoring/debunked) + `.badge-severity-{high|medium|low}` `.skeleton` `.section-header/title/subtitle` `.pulse-dot` `.mono` `.nav-link` `.statsbar-grid` `.hero-container` `.hero-btn-*` `.timeline-*` `.overview-grid` `.spin` `.footer-link`

---

## 7. API Routes (in detail)

### `GET /api/fetch-timeline` (GitHub Actions cron, 30min)
1. Rate-limited (6 req/min/IP).
2. `fetchTimelineNews()` — pulls from **GDELT + Currents + Google News RSS + NewsData `/latest` + GNews**, dedupes, enriches thin articles with real bodies.
3. Each article → Groq `groq/compound` via `runTimelineGroqMessages` (timeline key pool) → JSON event.
4. Validates ≥2 bullets; skips duplicates vs existing `events.title`; caps future dates; computes `day_number`.
5. Inserts into `events` with `verified:false`, `is_locked:false`.
6. Returns `{ success, articles_fetched, inserted, skipped, errors, new_events }`.

### `GET /api/process-news?type=economics|world_affairs|rumors` (GitHub Actions cron, 30min)
1. Rate-limited (6 req/min/IP).
2. Fetches **Currents API (primary, realtime) + Google News RSS + NewsData `/latest` (`size=10` only) + GNews** — ~29–43 articles.
3. Enriches thin articles with bodies.
4. Per-section Groq prompt → JSON (`{skip:true}` if not relevant) → upsert into `{type}_news` on `title` conflict.
5. Returns `{ type, table, articles_fetched, inserted, skipped, skip_reasons }`.

### `GET /api/live-markets`
1. Rate-limited (20 req/min/IP).
2. Reads `market_cache`; if <30 min old and not `?force=true`, returns cached.
3. **Commodities:** Yahoo futures → OilpriceAPI → Alpha Vantage fallback.
4. **Markets:** Yahoo Finance indices (18 tickers).
5. **Forex:** ExchangeRate-API (~45 pairs vs USD).
6. Appends snapshot to `history` (capped at 48 = 24h), upserts `market_cache`.
7. Returns `{ oil, commodities, forex, markets, history, war_day, last_updated, from_cache }`.

### `GET /api/seed-timeline?secret=CRON_SECRET` (backfill, manual)
- Gap-aware: locks `FULL_TIMELINE` (Feb 28–Mar 20), then Groq-generates events only for under-covered windows. Params: `chunk` (days, default 7), `min` (per window, default 3). Purges placeholder titles only.

### `GET /api/backfill-news?type=&secret=` (backfill, manual)
- Gap-aware for `{type}_news`: skips well-covered ranges, purges placeholder titles, retries on rate limits. Params: `type`, `chunk` (default 7), `min` (default 2), `batch` (default 3).

### `GET /api/fetch-news?secret=CRON_SECRET` (LEGACY)
- Older monolithic generator (timeline + economics + world_affairs + rumors via Groq). Superseded by `process-news`/`fetch-timeline` but kept. Enforces `LOCK_BOUNDARY = '2026-03-20'` — never generates on/before it.

---

## 8. AI Ingestion Pipeline

### News sources (each section)
| Source | Type | Realtime? | Key | Notes |
|---|---|---|---|---|
| Currents API | API | ✅ yes | `CURRENTS_KEY` | ~250 req/day free; primary fresh source |
| Google News RSS | RSS | ✅ yes | none | free; titles only (desc = source HTML); real URL parsed from anchor |
| GDELT | API | ✅ yes | none | rich content; strict 1 req/5s self-throttle; returns `[]` on 429 |
| NewsData `/latest` | API | ⚠️ ~12h delay | `NEWSDATA_KEY` | free tier rejects `size=20` → always `size=10`; content often placeholder |
| GNews | API | ⚠️ ~12h delay | `GNEWS_KEY` | free tier rate-limited (100 req/day) |

### Article enrichment (`lib/articleExtractor.js`)
- Thin articles (title-only or short descriptions) get real bodies fetched from their URLs.
- Strips HTML/scripts/boilerplate, keeps text-heavy paragraphs, caps ~3000 chars.
- `news.google.com` links are JS redirects → blocked (can't resolve server-side).

### Groq key pools (`lib/groqClients.js`) — per-section budgets
| Key env var | Section | Used by |
|---|---|---|
| `GROQ_TIMELINE_KEY_1` | Timeline | `fetch-timeline`, `seed-timeline` |
| `GROQ_KEY_ORG_2` | Economics | `process-news?type=economics` |
| `GROQ_KEY_ORG_3` | World Affairs + Rumors | `process-news?type=world_affairs|rumors` |
| `GROQ_KEY_ORG_4` | **Shared backup for all** | used on 429 |

- Model: **`groq/compound` everywhere**.
  - ⚠️ Do NOT switch timeline to `openai/gpt-oss-120b` — testing showed it returns `{"skip":true}` for legitimate war events (too conservative).
- Groq free tier = 100K tokens/day **per organization**. Keys in the same org share one budget; rotation only helps across orgs. On TPD exhaustion Groq returns `429 type:"tokens"` with `retry after` — retry after reset.

---

## 9. Supabase Schema (tables used)

| Table | Key columns |
|---|---|
| `events` | id, title, description (JSON: date/time/day_number/context_header/bullets), category, severity, source, source_url, verified, is_locked, published_at, generated_by, created_at |
| `prices` | id, asset_name, price, change_pct, currency, why_it_matters |
| `countries` | id, name, code, stance, impact_score, un_vote |
| `world_affairs` | country, flag, stance, stance_color, official_name, military_involvement, latest_statement, summary |
| `rumors` | title, source_type, confidence, confidence_score, detail, region, first_seen, verified, disclaimer |
| `sources` | id, name, tier, url |
| `economics_news` | title (unique), summary, detail, category, severity, source, source_url, published_at, war_impact_note, verified |
| `world_affairs_news` | title (unique), summary, detail, category, severity, countries[], source, source_url, published_at |
| `rumors_news` | title (unique), summary, detail, category, severity, source, source_url, published_at, verified |
| `market_cache` | id (`'main'`), data (jsonb), updated_at |

All tables have **RLS enabled with public SELECT** (`USING (true)`).

---

## 10. Environment Variables (`.env.example`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_TIMELINE_KEY_1=gsk_...
GROQ_KEY_ORG_2=gsk_...
GROQ_KEY_ORG_3=gsk_...
GROQ_KEY_ORG_4=gsk_...
CURRENTS_KEY=
NEWSDATA_KEY=
GNEWS_KEY=
OILPRICE_KEY=
ALPHAVANTAGE_KEY=
EXCHANGERATE_KEY=
CRON_SECRET=
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_TRACING=false
```

> Note: `NEXT_PUBLIC_CRON_SECRET` was removed — never expose server-only secrets publicly.

---

## 11. Cron Schedule (GitHub Actions)

Vercel's Hobby plan allows only **1 cron run/day**, so scheduled ingestion moved to
**GitHub Actions** (`.github/workflows/data-refresh.yml`) — free on any plan, runs every
30 min, and calls the production endpoints below. `vercel.json` has **no crons** anymore.

```yaml
on:
  schedule:
    - cron: '*/30 * * * *'
```

| Endpoint hit | Purpose |
|---|---|
| `/api/fetch-timeline` | Timeline ingestion |
| `/api/process-news?type=economics` | Economics news |
| `/api/process-news?type=world_affairs` | World affairs news |
| `/api/process-news?type=rumors` | Rumors news |

- Budget: 1 job × ~1 min × 48 runs/day ≈ 1,440 min/month — under the free 2,000 min
  (unlimited if the repo is public).
- If the deployment URL differs from `conflictsee.vercel.app`, set repo variable
  `PRODUCTION_URL` (Settings → Secrets and variables → Actions → Variables).

---

## 12. Development Workflow

```bash
npm install
npm run dev        # local dev on http://localhost:3000
npm run lint       # ESLint (next lint)
npm run build      # production build
npm run start      # serve production build
```

**Deployment rules (CRITICAL):**
1. **Never push to GitHub automatically** — only on explicit `push to git` / `push to github` command.
2. **Never deploy to Vercel automatically** — the user deploys manually.
3. When told to push, run exactly: `git add .` → `git commit -m "description"` → `git push`.

---

## 13. Completed Features

- Hero with live IST clock (mounted-guarded)
- StatsBar animated counters (no inline styles)
- 4 pages: Timeline, Economics, World Affairs, Rumors (all client; Timeline page is server→client)
- World Affairs: static COUNTRY_PROFILES + live table + news, stance-grouped
- Rumors: merged feeds, UNVERIFIED banner, category/severity filters, expandable cards
- Auto-refresh 5 min + manual "Refresh Intel"/"Fetch Latest" buttons
- Backfilled timeline (Feb 28 → present) + economics/world_affairs/rumors news feeds
- Active route highlighting (mounted-guarded)
- Loading spinners/skeletons on all routes
- Favicon SVG + OG metadata
- Multi-source ingestion: Currents + Google News RSS + GDELT + NewsData + GNews
- Article body enrichment for thin feeds
- Per-section Groq key pools with shared backup (K4)

---

## 14. Removed / Deliberately Absent

- NO credibility score 0–100%
- NO community voting / upvote/downvote
- NO "Ask AI" page or `/api/ask` endpoint
- NO 5-year chart (`app/api/market-history` route removed; LongHistoryChart removed)
- Deleted dead code: `lib/apiClients.js`, `EconomicsSection.jsx`, `RumorsSection.jsx`, `WorldAffairsSection.jsx`
- Supabase realtime websocket removed (free tier ~200 concurrent cap) → replaced with 5-min polling

---

## 15. Scalability Notes (for 1000+ users)

- All reads are **client-side Supabase SELECT** (public RLS) — scales with Supabase, no server load.
- Server API routes are only hit by GitHub Actions cron + manual refresh buttons; Vercel free plan supports ~100K function invocations/day and 100GB bandwidth.
- In-memory rate limiting on public routes deters abuse.
- Avoid Supabase realtime websockets at scale (connection cap).

---

## 16. Known Caveats & Gotchas

- **Groq TPD budget** (100K/day/org) — shared per org; K4 gives a separate budget. Daily reset required to ingest when exhausted.
- **NewsData free** = ~12h delay, `size=10` only, content placeholders → falls back to `description`.
- **Google News RSS** has no article bodies — must be enriched, and its URLs are redirect wrappers.
- **GDELT** is flaky on some networks (429/connect timeouts) — module degrades to `[]` gracefully.
- **`upsert(..., { onConflict: 'title' })`** requires a unique constraint on `title` in each `*_news` table.
- **Hydration:** never `return null` on the server for time-dependent renders; use `useState('')` + `useEffect`.
