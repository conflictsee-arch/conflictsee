# ConflictSee — Agent Instructions
Last updated: March 2026

## Project
Real-time Iran-Israel war intelligence dashboard. 4 sections: Timeline, Economics, World Affairs, Rumors.

Tech stack: Next.js 14 (App Router) · Tailwind CSS · Supabase · Google Fonts

## Live URLs
- Production: https://conflictsee.vercel.app
- Supabase project: fxswdclbsngtydrcemeq

## Route Structure
```
/             → Home (Hero + StatsBar + 4 section cards)
/timeline     → Conflict Timeline (events table)
/economics    → Economic Dashboard (prices table)
/world-affairs → World Affairs (countries table)
/rumors       → Rumors & Intel (rumors table)
/ask-ai       → Ask AI (Groq llama3 powered)
/api/ask      → POST endpoint for AI chat
```

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
- Dark green (`#1a6b3c`) as primary accent
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
| Table       | Key columns                                                   |
|-------------|---------------------------------------------------------------|
| `events`    | id, timestamp_ist, headline, category, fact_check_status     |
| `prices`    | id, asset_name, price, change_pct, currency, why_it_matters  |
| `countries` | id, name, code, stance, impact_score, un_vote                |
| `rumors`    | id, headline, fact_check_verdict, status, groq_reasoning     |
| `sources`   | id, name, tier, url                                          |

All tables have RLS enabled with public SELECT policy (`USING (true)`).

## Completed Features
- Hero section with live IST clock (mounted-guarded)
- StatsBar with animated counters (no inline styles)
- 4 data sections fetching from Supabase (60s auto-refresh)
- Ask AI with Groq llama3-8b
- Framer-motion scroll animations (no borderColor in whileHover)
- Mobile responsive all pages
- Active route highlighting in navbar (mounted-guarded)
- Loading spinners for all 5 routes
- Favicon SVG + OG metadata
- Smooth scroll behavior

## Folder Structure
```
c:\code\Conflictsee\
├── app/
│   ├── api/ask/
│   ├── timeline/      (page.js + loading.jsx)
│   ├── economics/     (page.js + loading.jsx)
│   ├── world-affairs/ (page.js + loading.jsx)
│   ├── rumors/        (page.js + loading.jsx)
│   ├── ask-ai/        (page.js + loading.jsx)
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── Navbar.jsx
│   ├── StatsBar.jsx
│   ├── HeroSection.jsx
│   ├── Footer.jsx
│   ├── TimelineSection.jsx
│   ├── EconomicsSection.jsx
│   ├── WorldAffairsSection.jsx
│   └── RumorsSection.jsx
├── lib/
│   └── supabase.js
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
