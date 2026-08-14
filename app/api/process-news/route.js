import { createClient } from '@supabase/supabase-js'
import { groqWithPool } from '@/lib/groqClients'
import { rateLimit, clientIp } from '@/lib/rateLimit'
import { fetchCurrentsNews } from '@/lib/currentsNews'
import { fetchGoogleNews } from '@/lib/googleNews'
import { enrichArticlesWithBodies } from '@/lib/articleExtractor'
import { logInfo, logError } from '@/lib/structuredLog'

export const dynamic = 'force-dynamic'

// Each type maps to a new _news table
const TABLE_MAP = {
  economics: 'economics_news',
  world_affairs: 'world_affairs_news',
  rumors: 'rumors_news',
}

const QUERIES = {
  economics: 'Iran Israel oil prices sanctions economy',
  world_affairs: 'Iran war diplomacy',
  rumors: 'Iran Israel war claim intelligence report',
}

const PROMPTS = {
  economics: `You are an economics analyst for ConflictSee covering the Iran-Israel-US war (Feb 28 2026).
Extract from this article and return ONLY valid JSON:
{
  "title": "concise headline under 80 chars",
  "summary": "1 sentence with key stat or finding",
  "detail": "3-4 sentences of full economic context and war impact",
  "category": "Energy Markets|Global Economy|Emerging Markets|Sanctions|Trade|Currency",
  "severity": "High|Medium|Low",
  "war_impact_note": "1 sentence on how this directly relates to the war"
}
If not war-economics related: {"skip":true}`,

  world_affairs: `You are a geopolitical analyst for ConflictSee covering the Iran-Israel-US war (Feb 28 2026).
Extract from this article and return ONLY valid JSON:
{
  "title": "concise headline under 80 chars",
  "summary": "1 sentence key diplomatic or military finding",
  "detail": "3-4 sentences of full geopolitical context",
  "category": "Great Power Politics|NATO-Europe|Diplomacy|Humanitarian|Lebanon|Regional Actors|South Asia|Islamic World",
  "severity": "High|Medium|Low",
  "countries": ["CountryName1", "CountryName2"]
}
If not war-related: {"skip":true}`,

  rumors: `You are an intelligence analyst for ConflictSee. Find ONLY unverified, disputed, or anonymous source claims.
Extract from this article and return ONLY valid JSON:
{
  "title": "UNVERIFIED: [claim in under 70 chars]",
  "summary": "what is claimed and by whom (anonymous/opposition/single source)",
  "detail": "3-4 sentences of full context and why this cannot be verified",
  "category": "Intelligence|Nuclear|Leadership|Military|Diplomatic|Atrocity Claims",
  "severity": "High|Medium|Low"
}
If NO unverified claims found: {"skip":true}`,
}

export async function GET(request) {
  const rl = rateLimit(clientIp(request), 6, 60000)
  if (!rl.ok) {
    return Response.json(
      { error: 'Too many requests. Please wait before scanning again.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    )
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const ROUTE = 'process-news'

  if (!TABLE_MAP[type]) {
    return Response.json({ error: 'Invalid type. Use: economics, world_affairs, or rumors' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const query = QUERIES[type]

  // Fetch from all news sources in parallel (fresh-first: Currents + Google RSS + existing)
  const [currents, googleNews, newsData, gNews] = await Promise.allSettled([
    fetchCurrentsNews(query, 10),
    fetchGoogleNews(query, 15),
    fetch(
      `https://newsdata.io/api/1/latest?apikey=${process.env.NEWSDATA_KEY}&q=${encodeURIComponent(query)}&language=en&size=10`
    ).then(r => r.json()),
    fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&token=${process.env.GNEWS_KEY}`
    ).then(r => r.json()),
  ])

  const articles = []

  if (currents.status === 'fulfilled' && Array.isArray(currents.value)) {
    articles.push(...currents.value)
  }

  if (googleNews.status === 'fulfilled' && Array.isArray(googleNews.value)) {
    articles.push(...googleNews.value)
  }

  if (newsData.status === 'fulfilled' && newsData.value && Array.isArray(newsData.value.results)) {
    articles.push(
      ...newsData.value.results.map(a => {
        // NewsData free tier: content is often the placeholder string — fall back to description
        const rawContent = a.content || ''
        const isPlaceholder = rawContent.toLowerCase().includes('only available in paid plans')
        const effectiveContent = isPlaceholder ? (a.description || '') : rawContent
        return {
          title: a.title || '',
          content: effectiveContent.slice(0, 2000),
          url: a.link || '',
          source: a.source_id || 'newsdata',
          published_at: a.pubDate || '',
        }
      })
    )
  }

  if (gNews.status === 'fulfilled' && gNews.value && Array.isArray(gNews.value.articles)) {
    articles.push(
      ...gNews.value.articles.map(a => ({
        title: a.title || '',
        content: (a.content || a.description || '').slice(0, 2000),
        url: a.url || '',
        source: a.source?.name || 'gnews',
        published_at: a.publishedAt || '',
      }))
    )
  }

  // Deduplicate by title prefix
  const seen = new Set()
  const unique = articles.filter(a => {
    const k = a.title.toLowerCase().slice(0, 40)
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })

  // Enrich thin articles (Google News title-only, Currents short descriptions)
  // with real bodies so the section model has enough content to extract
  // structured news.
  await enrichArticlesWithBodies(unique, { limit: 10, minChars: 200 })

  const groq = { chat: { completions: { create: (opts) => groqWithPool[type](opts.messages?.map((m) => m.content).join('\n') || '', opts.max_tokens || 800, opts.temperature ?? 0.1) } } }
  let inserted = 0,
    skipped = 0
  const skipReasons = {}

  for (const article of unique) {
    // NewsData free tier returns ~28-char snippets (useless for analysis) — skip those
    if (!article.title || (article.content && article.content.length < 40)) {
      skipReasons.thin = (skipReasons.thin || 0) + 1
      skipped++
      continue
    }

    try {
      const raw = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.1,
        max_tokens: 800,
        messages: [
          { role: 'system', content: PROMPTS[type] },
          { role: 'user', content: `Title: ${article.title}\n\nContent: ${article.content}` },
        ],
      })

      const content = (raw || '').trim()
      const match = content?.match(/\{[\s\S]*\}/)
      if (!match) {
        skipReasons.no_json = (skipReasons.no_json || 0) + 1
        skipped++
        continue
      }

      const parsed = JSON.parse(match[0])
      if (parsed.skip) {
        skipReasons.groq_skip = (skipReasons.groq_skip || 0) + 1
        skipped++
        continue
      }

      const row = {
        title: parsed.title,
        summary: parsed.summary,
        detail: parsed.detail,
        category: parsed.category,
        severity: parsed.severity || 'Medium',
        source: article.source,
        source_url: article.url,
        verified: type !== 'rumors',
        published_at: article.published_at || new Date().toISOString(),
      }

      if (type === 'world_affairs') {
        row.countries = parsed.countries || []
      }
      if (type === 'economics') {
        row.war_impact_note = parsed.war_impact_note || ''
      }
      if (type === 'rumors') {
        row.verified = false
      }

      const tableName = TABLE_MAP[type]
      const { error } = await supabase.from(tableName).upsert(row, { onConflict: 'title' })

      if (!error) inserted++
      else {
        logError(ROUTE, 'upsert_error', error, { table: tableName, title: (row.title || '').slice(0, 40) })
        skipReasons.upsert = (skipReasons.upsert || 0) + 1
        skipped++
      }
    } catch (e) {
      logError(ROUTE, 'processing_error', e, { table: tableName })
      skipReasons.other = (skipReasons.other || 0) + 1
      skipped++
    }
  }

  logInfo(ROUTE, 'complete', { type, articles_fetched: unique.length, inserted, skipped })
  return Response.json({
    type,
    table: TABLE_MAP[type],
    articles_fetched: unique.length,
    inserted,
    skipped,
    skip_reasons: skipReasons,
  })
}
