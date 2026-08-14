import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { FULL_TIMELINE } from './full-timeline-data'
import { groqWithPool } from '@/lib/groqClients'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const GROQ_KEY = process.env.GROQ_TIMELINE_KEY_1
  if (!GROQ_KEY) {
    return NextResponse.json({ error: 'GROQ_TIMELINE_KEY_1 not set' }, { status: 500 })
  }

  function normalizeCategory(cat) {
    const s = (cat ?? '').toString().trim().toLowerCase()
    if (!s) return 'News'
    if (s.includes('nuclear')) return 'Military'
    if (s.includes('intelligence')) return 'Political'
    if (s.includes('military') || s.includes('war') || s.includes('strike') || s.includes('attack')) return 'Military'
    if (s.includes('diplomatic') || s.includes('diplomacy') || s.includes('meeting')) return 'Diplomatic'
    if (s.includes('economic') || s.includes('sanction') || s.includes('trade')) return 'Economic'
    if (s.includes('humanitarian') || s.includes('aid') || s.includes('evac') || s.includes('hospital')) return 'Humanitarian'
    if (s.includes('political') || s.includes('politics') || s.includes('un') || s.includes('resolution')) return 'Political'
    if (s.includes('news')) return 'News'
    return 'News'
  }

  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s)
  function normalizeSeverity(sev) {
    const s = (sev ?? '').toString().trim().toLowerCase()
    if (s === 'high') return 'High'
    if (s === 'medium') return 'Medium'
    return 'Low'
  }

  function parseJsonArrayFromContent(content) {
    const startIdx = content.indexOf('[')
    const endIdx = content.lastIndexOf(']')
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) {
      return null
    }
    const jsonStr = content.slice(startIdx, endIdx + 1)
    try {
      return JSON.parse(jsonStr)
    } catch (parseErr) {
      // Some models output trailing commas. Remove them before retrying.
      try {
        const cleaned = jsonStr.replace(/,\\s*([}\\]])/g, '$1')
        return JSON.parse(cleaned)
      } catch {
        return null
      }
    }
  }

  async function fetchGroqEvents(dateRangeLabel, dateRange, dayNumberStart, verifiedFlag) {
    const prompt = `You are a war correspondent covering the Iran-Israel-USA conflict of 2026.
Generate a HIGHLY DETAILED hour-by-hour timeline for ${dateRangeLabel} (${dateRange}).

IMPORTANT SOURCE RULES:
Use a diverse mix of sources — both Western AND Eastern/Middle Eastern:
Western: Reuters, AP, BBC News, CNN, The Guardian, New York Times, Washington Post, Al Jazeera English, Bloomberg, Financial Times, Times of Israel, Haaretz
Eastern/Middle Eastern: IRNA (Iranian state news), Press TV, Al Arabiya, Tehran Times, Mehr News Agency, Tasnim News, Ynet (Hebrew), Jerusalem Post, IDF Spokesperson, TASS, Xinhua, RT, Dawn (Pakistan), Times of India, Gulf News

Rules for events:
- Generate 12-18 events spread across this date range
- All event times MUST be in UTC (24hr) in the field "time" (HH:MM UTC)
- Events must be hour-by-hour realistic
- Each event must have 3-5 bullet points, with exact details:
  exact numbers, weapon names, city names, official names, casualty figures, coordinates
- Mix ALL types: military strikes, diplomatic meetings, humanitarian reports, economic impacts, protests, ceasefire attempts, official statements
- Build a realistic escalating narrative day by day
- Sources must be DIVERSE — alternate between Western, Israeli, Iranian, Gulf, Asian sources
- IMPORTANT: You must NOT generate duplicate or vague event titles. Each title must be a specific, distinct headline (e.g. "IDF Stryker Convoy Hit by Iranian Drones Near Khan Younis") — never generic ones like "Ceasefire Talks Underway" or "Military Escalation Continues".

Return ONLY a JSON array. Each item must have EXACTLY this shape:
{
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "day_number": ${dayNumberStart},
  "title": "Specific headline max 12 words",
  "context_header": "One line subtitle explaining broader significance",
  "bullets": [
    { "summary": "Short 1-line fact", "detail": "2-4 sentences with specific names, numbers, locations, weapon systems" }
  ],
  "source": "Reuters",
  "source_url": "https://reuters.com",
  "category": "Military",
  "severity": "High",
  "verified": ${verifiedFlag}
}

Constraints:
- All event dates MUST fall inside the range ${dateRange}
- Use the provided day_number start value. For events on later dates inside this call, increment day_number appropriately (Feb 28, 2026 = Day 1).
- verified must be exactly ${verifiedFlag} for all returned events in this call.

Return ONLY valid JSON array (no markdown, no extra text). Start your response immediately with [ and end with ].`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 6000,
        temperature: 0.1,
      }),
    })

    const data = await res.json()
    if (!res.ok || data?.error) {
      // Try the rotation pool as a fallback before giving up.
      try {
        const fallback = await groqWithPool.timeline(prompt, 6000, 0.1)
        const fbParsed = parseJsonArrayFromContent(fallback)
        if (Array.isArray(fbParsed)) return fbParsed
      } catch {
        // fall through to error
      }
      const msg = data?.error?.message || JSON.stringify(data).slice(0, 300)
      throw new Error(`Groq call failed: ${res.status} ${msg}`)
    }
    const content = data.choices?.[0]?.message?.content
    if (!content) return []

    const parsed = parseJsonArrayFromContent(content)
    if (!Array.isArray(parsed)) {
      const preview = typeof content === 'string' ? content.slice(0, 500) : ''
      throw new Error(`Groq JSON parse failed. Preview: ${preview}`)
    }
    return parsed
  }

  try {
    const supabase = getSupabase()

    // ✅ No destructive delete — the gap-aware generator below only
    //    purges placeholder-titled unlocked events and fills under-
    //    covered windows, so an interrupted/budget-capped run can
    //    never wipe existing coverage.

    // Confirm locked data is safe:
    const { count: lockedCount } =
      await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .eq('is_locked', true)
    
    console.log(
      `🔒 ${lockedCount} verified events protected and untouched`
    )

    // TASK 6 — Best-effort unique constraint (may fail depending on Supabase RPC availability)
    try {
      await supabase.rpc('query', {
        query_text: `ALTER TABLE events ADD CONSTRAINT events_title_date_unique UNIQUE (title, published_at);`,
      })
    } catch {
      // Ignore if not available; we still dedupe in code.
    }

    let total = 0
    let saved = 0
    const errors = []

    // TASK 5 — Insert verified hardcoded timeline (UTC times, bullets as objects)
    // Deduped by title so re-running never duplicates locked rows.
    const { data: allExistingTitles } = await supabase
      .from('events')
      .select('title')
    const existingTitleSet = new Set(
      (allExistingTitles || []).map((e) => (e.title || '').toLowerCase())
    )

    if (Array.isArray(FULL_TIMELINE) && FULL_TIMELINE.length > 0) {
      for (const event of FULL_TIMELINE) {
        const titleKey = (event.title || '').toLowerCase()
        if (existingTitleSet.has(titleKey)) continue
        existingTitleSet.add(titleKey)

        const published_at = new Date(`${event.date}T${event.time}:00Z`).toISOString()
        const descriptionPayload = JSON.stringify({
          context_header: event.context_header ?? '',
          bullets: Array.isArray(event.bullets) ? event.bullets : [],
          day_number: typeof event.day_number === 'number' ? event.day_number : null,
        })

        const { error } = await supabase.from('events').insert([
          {
            title: event.title,
            description: descriptionPayload,
            source: event.source ?? null,
            source_url: event.source_url ?? null,
            published_at,
            category: normalizeCategory(event.category),
            severity: normalizeSeverity(event.severity),
            verified: !!event.verified,
            created_at: new Date().toISOString(),
          },
        ])
        total++
        if (!error) saved++
        else errors.push(error.message)
      }
    } else {
      // Hard requirement: to complete Task 5 we must insert your provided verified dataset.
      // Groq is currently rate-limited (429), so we fail fast instead of burning more tokens.
      return NextResponse.json(
        {
          success: false,
          error: 'FULL_TIMELINE dataset is missing/empty.',
          hint: 'Paste the complete FULL_TIMELINE array into app/api/seed-timeline/full-timeline-data.js',
        },
        { status: 400 }
      )
    }

    // ── Gap-aware Groq timeline: purge placeholder rows, then only
    //    generate for under-covered 7-day windows. Never deletes the
    //    whole unlocked dataset — a partial/budget-capped run won't
    //    wipe existing coverage.
    const IST_OFFSET_MINUTES = 330
    const baseDayMs = new Date('2026-02-28T00:00:00Z').getTime()
    const getISTDateYYYYMMDD = () => {
      const utcMs = Date.now()
      const istMs = utcMs + IST_OFFSET_MINUTES * 60 * 1000
      return new Date(istMs).toISOString().slice(0, 10)
    }

    const groqStartDate = '2026-03-21'
    const endDate = getISTDateYYYYMMDD()
    const chunkDays = Math.max(1, parseInt(new URL(req.url).searchParams.get('chunk') || '7', 10))
    const minPerChunk = Math.max(1, parseInt(new URL(req.url).searchParams.get('min') || '3', 10))

    const startMs = new Date(`${groqStartDate}T00:00:00Z`).getTime()
    const endMs = new Date(`${endDate}T00:00:00Z`).getTime()

    const PLACEHOLDER_RE = /^(ceasefire agreement reached|diplomatic breakthrough reported|ceasefire talks underway|peace talks stall|peace talks scheduled|military escalation continues|diplomatic efforts underway|humanitarian crisis deepens|economic sanctions imposed|cyberattacks intensify|iran launches missile strike|war economy|israeli military launches ground invasion)$/i

    if (Number.isFinite(startMs) && Number.isFinite(endMs) && endMs >= startMs) {
      let groqInserted = 0
      let groqSkipped = 0
      let purged = 0
      const skippedRanges = []

      // 1) Purge placeholder-titled unlocked events (keep real ones)
      const { data: allUnlocked } = await supabase
        .from('events')
        .select('id, title')
        .eq('is_locked', false)
      for (const row of allUnlocked || []) {
        if (PLACEHOLDER_RE.test((row.title || '').trim())) {
          const { error } = await supabase.from('events').delete().eq('id', row.id)
          if (!error) purged++
        }
      }
      if (purged > 0) console.log(`🧹 Purged ${purged} placeholder timeline events`)

      // 2) For each window: if already well-covered, skip; else generate.
      for (let cStart = new Date(startMs); cStart.getTime() <= endMs; ) {
        const cEnd = new Date(cStart)
        cEnd.setDate(cEnd.getDate() + chunkDays - 1)
        if (cEnd.getTime() > endMs) cEnd.setTime(endMs)

        const rangeFrom = cStart.toISOString().slice(0, 10)
        const rangeTo = cEnd.toISOString().slice(0, 10)
        const dayNumberStart = Math.floor((cStart.getTime() - baseDayMs) / 86400000) + 1

        // Load existing (unlocked) events in this range for dedupe/coverage
        const { data: rangeEvents } = await supabase
          .from('events')
          .select('id, title, published_at')
          .gte('published_at', `${rangeFrom}T00:00:00Z`)
          .lte('published_at', `${rangeTo}T23:59:59Z`)
        const rangeRows = rangeEvents || []
        const rangeTitles = new Set(rangeRows.map(e => (e.title || '').toLowerCase()))

        // Skip already-well-covered windows
        if (rangeRows.length >= minPerChunk) {
          skippedRanges.push(rangeFrom)
          cStart.setDate(cStart.getDate() + chunkDays)
          continue
        }

        const dateRangeLabel = `${rangeFrom} → ${rangeTo}`
        let groqEvents = []
        try {
          groqEvents = await fetchGroqEvents(
            dateRangeLabel,
            `${rangeFrom} - ${rangeTo}`,
            dayNumberStart,
            false
          )
        } catch (e) {
          errors.push(`Groq failed ${rangeFrom}–${rangeTo}: ${e.message}`)
          cStart.setDate(cStart.getDate() + chunkDays)
          continue
        }

        for (const event of groqEvents) {
          if (!event?.date) continue
          if (event.date < groqStartDate) continue
          if (PLACEHOLDER_RE.test((event.title || '').trim())) continue

          const published_at = new Date(`${event.date}T${event.time}:00Z`).toISOString()
          const descriptionPayload = JSON.stringify({
            context_header: event.context_header ?? '',
            bullets: Array.isArray(event.bullets) ? event.bullets : [],
            day_number: typeof event.day_number === 'number' ? event.day_number : null,
          })

          const titleKey = (event.title || '').toLowerCase()
          if (rangeTitles.has(titleKey)) {
            groqSkipped++
            continue
          }
          rangeTitles.add(titleKey)

          const { error } = await supabase.from('events').insert([
            {
              title: event.title,
              description: descriptionPayload,
              source: event.source ?? null,
              source_url: event.source_url ?? null,
              published_at,
              category: normalizeCategory(event.category),
              severity: normalizeSeverity(event.severity),
              verified: false,
              created_at: new Date().toISOString(),
            },
          ])
          total++
          if (!error) {
            groqInserted++
            saved++
          } else {
            errors.push(error.message)
          }
        }

        cStart.setDate(cStart.getDate() + chunkDays)
        // Pace calls to respect Groq free-tier RPM limits (both orgs share the
        // same org-level RPM budget only within their own org, but hammering
        // either key back-to-back trips 429).
        await new Promise((res) => setTimeout(res, 4000))
      }

      console.log(`🧩 Chunked timeline done: +${groqInserted} inserted, ${groqSkipped} deduped, ${skippedRanges.length} windows skipped`)
    }

    return NextResponse.json({
      success: true,
      total,
      saved,
      errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
      full_timeline_used: Array.isArray(FULL_TIMELINE) && FULL_TIMELINE.length > 0,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
