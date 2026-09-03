import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { groqWithPool } from '@/lib/groqClients'
import { logInfo, logError } from '@/lib/structuredLog'
import { WAR_START } from '@/lib/constants'

export const dynamic = 'force-dynamic'

const ROUTE = 'backfill-news'

const TABLE_MAP = {
  economics: 'economics_news',
  world_affairs: 'world_affairs_news',
  rumors: 'rumors_news',
}

const PROMPTS = {
  economics: `You are a war-economics analyst for ConflictSee covering the Iran-Israel-USA war (started Feb 28 2026).
I will give you a date range. Generate 5 realistic, distinct news items about the war economy DURING that range.
Each item must fit its date — oil/gas price moves, sanctions, currency crashes, supply-chain shocks, defense spending, market reactions to specific events of that period.
Return ONLY a valid JSON array (no markdown), each item EXACTLY:
{
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "title": "headline under 80 chars",
  "summary": "1 sentence key stat or finding",
  "detail": "3-4 sentences of full economic context and war impact",
  "category": "Energy Markets|Global Economy|Emerging Markets|Sanctions|Trade|Currency",
  "severity": "High|Medium|Low",
  "war_impact_note": "1 sentence on how this directly relates to the war",
  "source": "Reuters|Bloomberg|Financial Times|Al Jazeera|Times of India|Dawn|Gulf News|AP",
  "source_url": "https://example-real-domain.com"
}
Rules:
- Dates MUST fall inside my given range, spread across it
- Vary times across the day
- No duplicate titles
- Be specific with real numbers`,
  world_affairs: `You are a geopolitical analyst for ConflictSee covering the Iran-Israel-USA war (started Feb 28 2026).
I will give you a date range. Generate 5 realistic, distinct news items about world affairs DURING that range.
Each item must fit its date — UN votes, diplomatic visits, country stances, humanitarian appeals, regional reactions, NATO/EU statements of that period.
Return ONLY a valid JSON array (no markdown), each item EXACTLY:
{
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "title": "headline under 80 chars",
  "summary": "1 sentence key diplomatic or military finding",
  "detail": "3-4 sentences of full geopolitical context",
  "category": "Great Power Politics|NATO-Europe|Diplomacy|Humanitarian|Lebanon|Regional Actors|South Asia|Islamic World",
  "severity": "High|Medium|Low",
  "countries": ["CountryName1", "CountryName2"],
  "source": "Reuters|AP|BBC|Al Jazeera|Xinhua|TASS|Dawn|Gulf News|Haaretz",
  "source_url": "https://example-real-domain.com"
}
Rules:
- Dates MUST fall inside my given range, spread across it
- Vary times across the day
- No duplicate titles
- Be specific with real country names`,
  rumors: `You are an OSINT intelligence analyst for ConflictSee tracking unverified claims about the Iran-Israel-USA war (started Feb 28 2026).
I will give you a date range. Generate 5 realistic UNVERIFIED intelligence reports/rumors DURING that range.
Each item must fit its date — anonymous-source claims, Telegram chatter, unverified military moves, leadership rumors of that period.
Return ONLY a valid JSON array (no markdown), each item EXACTLY:
{
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "title": "UNVERIFIED: [claim in under 70 chars]",
  "summary": "what is claimed and by whom (anonymous/opposition/single source)",
  "detail": "3-4 sentences of full context and why this cannot be verified",
  "category": "Intelligence|Nuclear|Leadership|Military|Diplomatic|Atrocity Claims",
  "severity": "High|Medium|Low",
  "source": "Telegram|Social Media|Anonymous Official|OSINT Report|Opposition Media",
  "source_url": "https://example-real-domain.com"
}
Rules:
- Dates MUST fall inside my given range, spread across it
- Vary times across the day
- No duplicate titles
- Always clearly unverified and specific`,
}

function parseJsonArrayFromContent(content) {
  if (!content) return null
  const startIdx = content.indexOf('[')
  const endIdx = content.lastIndexOf(']')
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return null
  const jsonStr = content.slice(startIdx, endIdx + 1)
  try {
    return JSON.parse(jsonStr)
  } catch {
    try {
      const cleaned = jsonStr.replace(/,\s*([}\]])/g, '$1')
      return JSON.parse(cleaned)
    } catch {
      return null
    }
  }
}

async function callGroq(prompt) {
  try {
    return await groqWithPool.backfill(prompt, 1200, 0.3)
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const type = searchParams.get('type')
  if (!TABLE_MAP[type]) {
    return NextResponse.json({ error: 'Invalid type. Use: economics, world_affairs, or rumors' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const chunkDays = parseInt(searchParams.get('chunk') || '7', 10)
  const endDate = new Date()
  const table = TABLE_MAP[type]
  const prompt = PROMPTS[type]
  const batchSize = parseInt(searchParams.get('batch') || '3', 10)

  // ── Load existing coverage so we only generate for under-filled ranges ──
  const { data: existingRows } = await supabase
    .from(table)
    .select('id, published_at, title')
  const existingByRange = {}
  for (const row of existingRows || []) {
    if (!row?.published_at) continue
    const monthKey = row.published_at.slice(0, 7)
    if (!existingByRange[monthKey]) existingByRange[monthKey] = []
    existingByRange[monthKey].push(row)
  }

  const minPerChunk = parseInt(searchParams.get('min') || '2', 10)

  // Detect placeholder/garbage titles so we can replace them
  const isPlaceholderTitle = (title) => {
    const t = (title || '').trim()
    if (t.length < 10) return true
    const placeholders = [
      /^us[- ]iran war$/i,
      /^iran'?s economy$/i,
      /^trump hid/i,
      /^pentagon yemen massacres$/i,
      /^war economy$/i,
      /^regional conflicts?/i,
    ]
    return placeholders.some((re) => re.test(t))
  }

  const all = []
  const errors = []
  const skippedRanges = []

  // ── Purge existing placeholder/garbage rows so they get replaced ──
  let purged = 0
  for (const row of existingRows || []) {
    if (row?.title && isPlaceholderTitle(row.title)) {
      const { error } = await supabase.from(table).delete().eq('id', row.id)
      if (!error) purged++
    }
  }
  if (purged > 0) console.log(`🧹 Purged ${purged} placeholder rows from ${table}`)

  // Walk from war start to today in chunks
  for (let start = new Date(WAR_START); start < endDate; ) {
    const end = new Date(start)
    end.setDate(end.getDate() + chunkDays - 1)
    if (end > endDate) end.setTime(endDate.getTime())

    const fromLabel = start.toISOString().slice(0, 10)
    const toLabel = end.toISOString().slice(0, 10)

    // Count rows already covering this range (by month overlap)
    const monthKeys = new Set()
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      monthKeys.add(d.toISOString().slice(0, 7))
    }
    const monthRows = []
    for (const mk of monthKeys) monthRows.push(...(existingByRange[mk] || []))
    const inRange = monthRows.filter((r) => {
      const k = r.published_at.slice(0, 10)
      return k >= fromLabel && k <= toLabel
    })
    const hasPlaceholder = inRange.some((r) => isPlaceholderTitle(r.title))

    // Skip ranges that already have enough real (non-placeholder) content
    if (inRange.length >= minPerChunk && !hasPlaceholder) {
      skippedRanges.push(fromLabel)
      start.setDate(start.getDate() + chunkDays)
      continue
    }

    const rangePrompt = `${prompt}\n\nDATE RANGE: ${fromLabel} to ${toLabel}. Generate exactly ${batchSize} items.`

    try {
      const raw = await callGroq(rangePrompt)
      const parsed = parseJsonArrayFromContent(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const good = parsed.filter((p) => !isPlaceholderTitle(p?.title))
        if (good.length > 0) {
          all.push(...good.map((p) => ({ ...p, _range: [fromLabel, toLabel] })))
        } else {
          errors.push(`Only placeholder titles for ${fromLabel}–${toLabel}`)
        }
      } else {
        errors.push(`No parseable items for ${fromLabel}–${toLabel}`)
      }
    } catch (e) {
      errors.push(`Groq failed ${fromLabel}–${toLabel}: ${e.message}`)
      logError(ROUTE, 'groq_range_failed', e, { range: `${fromLabel}-${toLabel}` })
    }

    start.setDate(start.getDate() + chunkDays)
  }

  // Insert with dedupe
  let inserted = 0
  let skipped = 0
  for (const item of all) {
    const published_at = new Date(`${item.date}T${item.time}:00Z`).toISOString()
    const row = {
      title: item.title,
      summary: item.summary || '',
      detail: item.detail || '',
      category: item.category || 'General',
      severity: item.severity || 'Medium',
      source: item.source || 'ConflictSee',
      source_url: item.source_url || null,
      published_at,
    }
    if (type === 'world_affairs') row.countries = Array.isArray(item.countries) ? item.countries : []
    if (type === 'economics') row.war_impact_note = item.war_impact_note || ''
    if (type === 'rumors') row.verified = false

    const { data: existing } = await supabase
      .from(table)
      .select('id')
      .eq('title', item.title)
      .maybeSingle()

    if (existing) {
      skipped++
      continue
    }

    const { error } = await supabase.from(table).insert(row)
    if (!error) inserted++
    else {
      errors.push(error.message)
      logError(ROUTE, 'insert_error', error, { table, title: (item.title || '').slice(0, 40) })
      skipped++
    }
  }

  logInfo(ROUTE, 'complete', { type, generated: all.length, inserted, skipped, purged, errors: errors.length })
  return NextResponse.json({
    success: true,
    type,
    table,
    range: `${WAR_START.toISOString().slice(0, 10)} → ${endDate.toISOString().slice(0, 10)}`,
    generated: all.length,
    inserted,
    skipped,
    purged,
    skipped_ranges: skippedRanges.length,
    errors: errors.slice(0, 5),
  })
}