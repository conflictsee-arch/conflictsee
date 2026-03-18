# ConflictSee — Agent Instructions

## Project
Real-time Iran-Israel war intelligence dashboard. 4 sections: Timeline, Economics, World Affairs, Rumors.

Tech stack: Next.js 14 (App Router) · Tailwind CSS · Supabase · Google Fonts

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

## Reusable CSS Classes
`.card` · `.card-featured` · `.btn-primary` · `.btn-secondary`
`.badge` + `.badge-military` `.badge-diplomatic` `.badge-economic` `.badge-humanitarian` `.badge-nuclear`
`.badge-verified` · `.badge-unconfirmed` · `.badge-monitoring` · `.badge-debunked`
`.skeleton` · `.section-header` · `.section-title` · `.section-subtitle` · `.pulse-dot` · `.mono`

## Supabase Tables
| Table       | Key columns                                                   |
|-------------|---------------------------------------------------------------|
| `events`    | id, timestamp_ist, headline, category, fact_check_status     |
| `prices`    | id, asset_name, price, change_pct, currency, why_it_matters  |
| `countries` | id, name, code, stance, impact_score, un_vote                |
| `rumors`    | id, headline, fact_check_verdict, status, groq_reasoning     |
| `sources`   | id, name, tier, url                                          |

## Removed Features
- NO credibility score 0–100%
- NO community voting
- NO upvote/downvote buttons

## Folder Structure
```
c:\code\Conflictsee\
├── app/
│   ├── api/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── skeletons/
│   ├── Navbar.jsx
│   └── StatsBar.jsx
├── lib/
│   └── supabase.js
├── public/
│   └── logo/
├── .env.local
├── AGENTS.md
└── package.json
```
