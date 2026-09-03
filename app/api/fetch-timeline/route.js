import { createClient } from '@supabase/supabase-js'
import { runTimelineGroqMessages, TIMELINE_SYSTEM_PROMPT } from '@/lib/timelineGroq'
import { mapWithConcurrency } from '@/lib/groqClients'
import { fetchTimelineNews } from '@/lib/timelineNews'
import { rateLimit, clientIp } from '@/lib/rateLimit'
import { logInfo, logError } from '@/lib/structuredLog'
import { WAR_START } from '@/lib/constants'

const ROUTE = 'fetch-timeline'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function GET(request) {
  const rl = rateLimit(clientIp(request), 6, 60000)
  if (!rl.ok) {
    return Response.json(
      { error: 'Too many requests. Please wait before fetching again.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    )
  }

  try {
    const supabase = getSupabase()

    // 1. Fetch latest news articles
    let articles
    try {
      articles = await fetchTimelineNews()
    } catch (err) {
      return Response.json({ error: 'News fetch failed: ' + err.message }, { status: 500 })
    }

    if (!articles.length) {
      return Response.json({ 
        success: true,
        message: articles.length === 0 
          ? 'No articles from news APIs — check NEWSDATA_KEY and GNEWS_KEY' 
          : 'Processed',
        articles_fetched: articles.length,
        inserted: 0,
        skipped: 0,
        errors: 0
      })
    }

    // 2. Get existing titles to avoid duplicates
    const { data: existing } = await supabase
      .from('events')
      .select('title')

    const existingTitles = new Set(
      (existing || []).map(e => e.title.toLowerCase().slice(0, 40))
    )

    let inserted = 0
    let skipped = 0
    let errors = 0
    const results = []

    // 3. Extract events with Groq — 3 concurrent calls so the endpoint
    // finishes well within Vercel's serverless timeout.
    // Cap articles per run; cron runs every 3h so 10 newest is plenty.
    const capped = articles.slice(0, 10)
    skipped += articles.length - capped.length

    // Phase 1: parallel Groq extraction (thin articles pre-filtered)
    const extractable = capped.filter(a => a.content && a.content.length >= 20)
    skipped += capped.length - extractable.length

    const extracted = await mapWithConcurrency(extractable, 3, async (article) => {
      const raw = await runTimelineGroqMessages([
        { role: 'system', content: TIMELINE_SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Article title: ${article.title}\n\nArticle URL: ${article.url || ''}\n\nArticle content: ${article.content.slice(0, 2000)}`,
        },
      ])
      if (!raw) return { status: 'empty' }
      let parsed
      try {
        const jsonMatch = raw.match(/\{[\s\S]*\}/)
        parsed = JSON.parse(jsonMatch?.[0] || raw)
      } catch {
        return { status: 'no_json' }
      }
      if (parsed.skip) return { status: 'irrelevant' }
      if (!parsed.title || !parsed.date || !parsed.bullets || parsed.bullets.length < 2) {
        return { status: 'invalid' }
      }
      return { status: 'ok', parsed, article }
    })

    // Phase 2: serial dedupe + insert (DB writes stay serial)
    for (const r of extracted) {
      if (!r.ok) {
        errors++
        logError(ROUTE, 'groq_item_error', r.error, {})
        continue
      }
      const { status, parsed, article } = r.value
      if (status !== 'ok') {
        skipped++
        continue
      }

        // Check duplicate
        const titleKey = (parsed.title || '').toLowerCase().slice(0, 40)
        if (existingTitles.has(titleKey)) { 
          console.log(`Duplicate skip: ${parsed.title?.slice(0, 30)}...`)
          skipped++; 
          continue; 
        }
        existingTitles.add(titleKey)

        // 📅 Date Capping & Day Number Calculation
        const warStart = WAR_START
        let eventDate = new Date(parsed.date + 'T00:00:00Z')
        const today = new Date()
        today.setHours(23, 59, 59, 999)

        // Cap future dates to today
        if (eventDate > today) {
          console.log(`Capping future date: ${parsed.date} → today`)
          parsed.date = new Date().toISOString().split('T')[0]
          eventDate = new Date(parsed.date + 'T00:00:00Z')
        }

        const dayNumRaw = Math.floor((eventDate - warStart) / (1000 * 60 * 60 * 24)) + 1
        
        // Also cap day_number to max days since war started
        const maxDay = Math.floor((today - warStart) / (1000 * 60 * 60 * 24)) + 1
        const finalDayNum = Math.min(dayNumRaw, maxDay)

        // Build Supabase row
        const sourceUrl = [
          parsed.source_url,
          article.url,
        ].find(u => u && !/^(not provided|n\/a|none|null)$/i.test(String(u).trim())) || null

        const { error } = await supabase.from('events').insert({
          title: parsed.title,
          description: JSON.stringify({
            date: parsed.date,
            time: parsed.time || '12:00',
            day_number: finalDayNum,
            context_header: parsed.context_header || '',
            bullets: parsed.bullets,
          }),
          category: parsed.category || 'Military',
          severity: parsed.severity || 'Medium',
          source: parsed.source || article.source,
          source_url: sourceUrl,
          verified: false,
          published_at: new Date(
            parsed.date + 'T' + (parsed.time || '12:00') + ':00Z'
          ).toISOString(),
          is_locked: false,
          created_at: new Date().toISOString(),
        })

        if (error) {
          errors++
          logError(ROUTE, 'insert_error', error, { title: (parsed.title || '').slice(0, 40) })
        } else {
          inserted++
          results.push(parsed.title)
        }
    }

    logInfo(ROUTE, 'complete', { articles_fetched: articles.length, inserted, skipped, errors })
    return Response.json({
      success: true,
      message: 'Processed',
      articles_fetched: articles.length,
      inserted,
      skipped,
      errors,
      new_events: results,
    })
  } catch (error) {
    logError(ROUTE, 'unhandled_error', error)
    return Response.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

