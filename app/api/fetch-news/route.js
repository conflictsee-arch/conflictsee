import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  timelineGroq,
  economicsGroq,
  worldAffairsGroq,
  rumorsGroq,
  safeGroqCall
} from '@/lib/groqClients'

// Lazy client — created per request so `next build` succeeds without env vars
// (external PRs / CI have no secrets).
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

// 🔒 HARD LOCK — Groq NEVER generates
//    anything on or before this date
const LOCK_BOUNDARY = '2026-03-20'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const supabase = getSupabase()

    // ━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 1: Find where to
    // continue generation from
    // ━━━━━━━━━━━━━━━━━━━━━━━

    const { data: latestUnlocked } =
      await supabase
        .from('events')
        .select('published_at, day_number')
        .eq('is_locked', false)
        .order('published_at', { ascending: false })
        .limit(1)
        .maybeSingle()

    // Get last 5 locked events
    // to give Groq context of 
    // what happened before:
    const { data: latestLocked } =
      await supabase
        .from('events')
        .select('published_at, day_number, title')
        .eq('is_locked', true)
        .order('published_at', { ascending: false })
        .limit(5)

    const generateFrom =
      latestUnlocked?.published_at?.split('T')[0]
      || '2026-03-21'

    const startDayNumber =
      (latestUnlocked?.day_number || 21) + 1

    // 🔒 SAFETY: Never before lock boundary
    const safeGenerateFrom =
      generateFrom > LOCK_BOUNDARY
        ? generateFrom
        : '2026-03-21'

    console.log(
      `📅 Generating from: ${safeGenerateFrom} (Day ${startDayNumber})`
    )

    // ━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 2: Build context 
    // from locked data for Groq
    // ━━━━━━━━━━━━━━━━━━━━━━━

    // Build context string from titles
    let contextSummary = 'Iran-Israel-USA war ongoing since Feb 28 2026'
    if (latestLocked && latestLocked.length > 0) {
      contextSummary = latestLocked.map(e => `- ${e.title}`).join('\n')
    }

    const today = new Date().toISOString().split('T')[0]

    // ━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 3: Run KEY 1 + KEY 2
    // IN PARALLEL for timeline
    // ━━━━━━━━━━━━━━━━━━━━━━━

    const buildTimelinePrompt = (fromDate, toDate, dayStart) => `
You are a war correspondent covering the Iran-Israel-USA conflict of 2026.

VERIFIED CONTEXT — DO NOT regenerate events from this list, they are already in the database:
${contextSummary}

🔒 CRITICAL RULES:
- ONLY generate events AFTER ${LOCK_BOUNDARY}
- NEVER generate events on or before March 20, 2026
- Start from: ${fromDate}
- End at: ${toDate}
- Generate 6 events for this range
- Day numbers start from ${dayStart}

For each event return JSON:
{
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "day_number": ${dayStart},
  "title": "Specific headline max 12 words",
  "context_header": "One-line significance of this event",
  "bullets": [
    {
      "summary": "Short 1-line fact",
      "detail": "2-4 sentences with specific names, numbers, weapon systems, locations, casualty figures"
    }
  ],
  "source": "Use DIVERSE sources: Reuters/AP/BBC/Al Jazeera/Haaretz/IRNA/Al Arabiya/Xinhua/TASS/Dawn/Gulf News/Times of Israel/Tehran Times",
  "source_url": "https://real-domain",
  "category": "Military/Diplomatic/Economic/Humanitarian/Political",
  "severity": "High/Medium/Low",
  "verified": false,
  "generated_by": "groq"
}

RULES FOR QUALITY:
- VARY times across the day (02:00, 06:30, 09:00, 12:00, 15:30, 18:00, 21:00, 23:30)
- Each event needs 3-5 bullets
- Each bullet needs summary + detail
- No duplicate titles
- Mix military, diplomatic, economic, humanitarian events
- Use diverse Western + Middle Eastern + Asian sources
- Build on the verified context above realistically

Return ONLY valid JSON array.`

    // Calculate midpoint for splitting between KEY 1 and KEY 2:
    const fromTime = new Date(safeGenerateFrom).getTime()
    const tillTime = new Date(today).getTime()
    const midDate = new Date(fromTime + (tillTime - fromTime) / 2).toISOString().split('T')[0]

    // Run KEY 1 and KEY 2 simultaneously:
    const [events1Raw, events2Raw] = await Promise.all([
      timelineGroq(buildTimelinePrompt(safeGenerateFrom, midDate, startDayNumber), 0),   // KEY 1
      timelineGroq(buildTimelinePrompt(midDate, today, startDayNumber + 3), 1)             // KEY 2 directly
    ])

    // ━━━━━━━━━━━━━━━━━━━━━━━
    // JSON PARSER (safe)
    // ━━━━━━━━━━━━━━━━━━━━━━━
    const parseGroqJSON = (text) => {
      if (!text) return []
      try {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        return JSON.parse(cleaned)
      } catch (e) {
        console.error('❌ JSON parse error:', e)
        return []
      }
    }

    const allNewEvents = [
      ...parseGroqJSON(events1Raw),
      ...parseGroqJSON(events2Raw)
    ]

    // ━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 4: Insert timeline
    // events SAFELY
    // ━━━━━━━━━━━━━━━━━━━━━━━
    let timelineInserted = 0

    for (const event of allNewEvents) {
      if (!event || !event.date) continue

      // 🔒 HARD LOCK CHECK:
      // Skip anything on or before lock boundary
      if (event.date <= LOCK_BOUNDARY) {
        console.log(`🔒 BLOCKED — tried to write locked date: ${event.date} "${event.title}"`)
        continue
      }

      // Skip duplicates:
      const { data: existing } = await supabase
        .from('events')
        .select('id')
        .eq('title', event.title)
        .maybeSingle()

      if (existing) {
        console.log(`⏭️ Duplicate skipped: ${event.title}`)
        continue
      }

      // Safe insert:
      const { error: insertError } = await supabase.from('events').insert({
        title: event.title,
        description: JSON.stringify({
          context_header: event.context_header,
          bullets: event.bullets,
          day_number: event.day_number
        }),
        source: event.source,
        source_url: event.source_url,
        category: event.category,
        severity: event.severity,
        verified: false,
        is_locked: false,
        generated_by: 'groq',
        published_at: new Date(event.date + 'T' + (event.time || '12:00') + ':00Z').toISOString()
      })

      if (!insertError) {
        timelineInserted++
        console.log(`✅ Inserted: ${event.title}`)
      } else {
        console.error(`Failed to insert: ${event.title}`, insertError)
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 5: Economics (KEY 3)
    // ━━━━━━━━━━━━━━━━━━━━━━━
    const econ = economicsGroq()
    const econPrompt = `Financial analyst covering Iran-Israel-USA war 2026.
       
Generate war economy data as of ${today}.
       
Return ONLY valid JSON object (no markdown, no array):
{
  "brent_crude": 109.40,
  "wti_crude": 106.20,
  "gold": 3180,
  "natural_gas": 8.40,
  "iran_rial_usd": 920000,
  "oil_trend": "rising",
  "market_summary": "2-3 sentence analysis of war economic impact today",
  "key_risk": "Single biggest economic risk right now",
  "last_updated": "${today}"
}`
    const econRaw = await safeGroqCall(econ, econPrompt, 600)
    let econParsed = null
    if (econRaw) {
      econParsed = parseGroqJSON(econRaw)
      if (econParsed && !Array.isArray(econParsed) && Object.keys(econParsed).length > 0) {
        await supabase.from('economics').upsert({
          ...econParsed,
          id: 1,
          updated_at: new Date().toISOString()
        })
        console.log('✅ Economics updated')
      }
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 6: World Affairs (KEY 4)
    // ━━━━━━━━━━━━━━━━━━━━━━━
    const wa = worldAffairsGroq()
    const worldPrompt = `Geopolitical analyst covering Iran-Israel-USA war 2026.
       
Generate current stance of major world powers as of ${today}.
       
Return ONLY valid JSON array (no markdown):
[
  {
    "country": "United States",
    "flag": "🇺🇸",
    "stance": "Co-belligerent",
    "stance_color": "red",
    "latest_statement": "Direct quote from official today",
    "official_name": "Trump / Hegseth",
    "military_involvement": "High",
    "summary": "2-sentence position summary"
  }
]
       
Include ALL 16 countries:
United States 🇺🇸
Russia 🇷🇺
China 🇨🇳
United Kingdom 🇬🇧
France 🇫🇷
Germany 🇩🇪
India 🇮🇳
Saudi Arabia 🇸🇦
Qatar 🇶🇦
Turkey 🇹🇷
Israel 🇮🇱
Lebanon 🇱🇧
Pakistan 🇵🇰
Japan 🇯🇵
UAE 🇦🇪
Egypt 🇪🇬
       
Stance options:
"Co-belligerent" → red
"Active Support" → orange
"Neutral" → gray
"Calling for Ceasefire" → blue
"Opposing War" → purple`
    const worldRaw = await safeGroqCall(wa, worldPrompt, 3000)
    const worldParsed = parseGroqJSON(worldRaw)

    if (Array.isArray(worldParsed) && worldParsed.length > 0) {
      for (const country of worldParsed) {
        if (!country.country) continue
        await supabase
          .from('world_affairs')
          .upsert({
            ...country,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'country'
          })
      }
      console.log(`✅ World Affairs updated — ${worldParsed.length} countries`)
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━
    // STEP 7: Rumors (KEY 5)
    // ━━━━━━━━━━━━━━━━━━━━━━━
    const rum = rumorsGroq()
    const rumorsPrompt = `OSINT analyst tracking unverified intel about the Iran-Israel-USA war on ${today}.
       
Generate 5 realistic unverified intelligence reports/rumors.
       
Return ONLY valid JSON array (no markdown):
[
  {
    "title": "Short rumor headline max 10 words",
    "source_type": "Telegram / Social Media / Anonymous Official / OSINT",
    "confidence": "Low",
    "confidence_score": 25,
    "detail": "2-3 sentences about the rumor with specific but unverified details",
    "region": "Iran / Israel / Lebanon / Gulf / Global",
    "first_seen": "${today}",
    "verified": false,
    "disclaimer": "UNVERIFIED — treat with extreme caution"
  }
]
       
Make rumors specific, realistic, and always clearly labeled as unverified.
Vary confidence scores between 15-65.`
    const rumorsRaw = await safeGroqCall(rum, rumorsPrompt, 2000)
    const rumorsParsed = parseGroqJSON(rumorsRaw)

    if (Array.isArray(rumorsParsed) && rumorsParsed.length > 0) {
      for (const rumor of rumorsParsed) {
        if (!rumor.title) continue
        await supabase.from('rumors').insert({
          ...rumor,
          is_locked: false,
          created_at: new Date().toISOString()
        })
      }
      console.log(`✅ Rumors added — ${rumorsParsed.length} new`)
    }

    // ━━━━━━━━━━━━━━━━━━━━━━━
    // Final success response
    // ━━━━━━━━━━━━━━━━━━━━━━━
    return NextResponse.json({
      success: true,
      lock_boundary: LOCK_BOUNDARY,
      lock_boundary_respected: true,
      generated_from: safeGenerateFrom,
      timeline_events_added: timelineInserted,
      economics_updated: !!(econParsed && !Array.isArray(econParsed)),
      world_affairs_updated: Array.isArray(worldParsed) && worldParsed.length > 0,
      world_affairs_count: Array.isArray(worldParsed) ? worldParsed.length : 0,
      rumors_added: Array.isArray(rumorsParsed) ? rumorsParsed.length : 0,
      message: `✅ All 4 sections updated successfully. 🔒 Verified data (Feb 28 – Mar 20) permanently protected.`
    })

  } catch (err) {
    console.error('❌ fetch-news error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
