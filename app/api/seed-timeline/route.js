import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { FULL_TIMELINE } from './full-timeline-data'
import { timelineGroq } from '@/lib/groqClients'

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
- Generate 12-18 events per date range
- All event times MUST be in UTC (24hr) in the field "time" (HH:MM UTC)
- Events must be hour-by-hour realistic
- Each event must have 3-5 bullet points, with exact details:
  exact numbers, weapon names, city names, official names, casualty figures, coordinates
- Mix ALL types: military strikes, diplomatic meetings, humanitarian reports, economic impacts, protests, ceasefire attempts, official statements
- Build a realistic escalating narrative day by day
- Sources must be DIVERSE — alternate between Western, Israeli, Iranian, Gulf, Asian sources

Return ONLY a JSON array. Each item must have EXACTLY this shape:
{
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "day_number": ${dayNumberStart},
  "title": "Breaking headline max 12 words",
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

    // ✅ SAFE DELETE — only removes
    //    unlocked/AI generated events
    // 🔒 NEVER touches is_locked = true
    const { error: deleteError } =
      await supabase
        .from('events')
        .delete()
        .eq('is_locked', false)
    
    if (deleteError) {
      console.error(
        'Delete error:', deleteError
      )
      return NextResponse.json({
        error: 'Delete failed'
      }, { status: 500 })
    }
    
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
    if (Array.isArray(FULL_TIMELINE) && FULL_TIMELINE.length > 0) {
      for (const event of FULL_TIMELINE) {
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

    // Groq for Mar 21 onward only (skip if already covered by FULL_TIMELINE)
    const IST_OFFSET_MINUTES = 330
    const baseDayMs = new Date('2026-02-28T00:00:00Z').getTime()
    const getISTDateYYYYMMDD = () => {
      const utcMs = Date.now()
      const istMs = utcMs + IST_OFFSET_MINUTES * 60 * 1000
      return new Date(istMs).toISOString().slice(0, 10)
    }

    const groqStartDate = '2026-03-21'
    const endDate = getISTDateYYYYMMDD()

    const startMs = new Date(`${groqStartDate}T00:00:00Z`).getTime()
    const endMs = new Date(`${endDate}T00:00:00Z`).getTime()

    if (Number.isFinite(startMs) && Number.isFinite(endMs) && endMs >= startMs) {
      const dayNumberStart = Math.floor((startMs - baseDayMs) / 86400000) + 1

      const dateRangeLabel = `Mar 21 - ${endDate}`
      const dateRange = `${groqStartDate} - ${endDate}`

      const groqEvents = await fetchGroqEvents(
        dateRangeLabel,
        dateRange,
        dayNumberStart,
        false
      )

      // Insert Groq events with duplicate check
      for (const event of groqEvents) {
        const published_at = new Date(`${event.date}T${event.time}:00Z`).toISOString()
        const descriptionPayload = JSON.stringify({
          context_header: event.context_header ?? '',
          bullets: Array.isArray(event.bullets) ? event.bullets : [],
          day_number: typeof event.day_number === 'number' ? event.day_number : null,
        })

        // Dedupe by title + published_at
        const { data: existing } = await supabase
          .from('events')
          .select('id')
          .eq('title', event.title)
          .eq('published_at', published_at)
          .maybeSingle()

        if (existing) {
          // eslint-disable-next-line no-continue
          continue
        }

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
        if (!error) saved++
        else errors.push(error.message)
      }
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
