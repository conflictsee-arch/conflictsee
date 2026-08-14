// GDELT DOC 2.0 API — free, unlimited (1 request / 5s, strict).
// Returns real article text — the richest key-free source for the timeline.
// Uses `mode=artlist&format=json` for JSON articles with content.
const GDELT_DOC_URL = 'https://api.gdeltproject.org/api/v2/doc/doc'

const GDELT_QUERIES = [
  'Iran Israel war',
  'IRGC missile Israel',
  'Hezbollah Israel Lebanon',
  'Hormuz strait tanker Iran',
  'Iran nuclear enrichment',
  'US Iran sanctions blockade',
]

let lastRequestMs = 0

async function rateLimitedFetch(url) {
  const sinceLast = Date.now() - lastRequestMs
  if (sinceLast < 5000) {
    await new Promise((r) => setTimeout(r, 5000 - sinceLast))
  }
  lastRequestMs = Date.now()
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    signal: AbortSignal.timeout(30000),
  })
  return res
}

export async function fetchGDELTNews(limit = 10) {
  const query = GDELT_QUERIES[Math.floor(Math.random() * GDELT_QUERIES.length)]
  try {
    const url =
      `${GDELT_DOC_URL}?query=${encodeURIComponent(query)}` +
      `&mode=artlist&format=json&maxrecords=${limit}&sort=DateDesc`
    const res = await rateLimitedFetch(url)
    if (!res.ok) return []
    const j = await res.json().catch(() => null)
    const articles = j?.articles || []
    return articles
      .map((a) => ({
        title: a.title || '',
        content: (a.content || '').slice(0, 2000),
        url: a.url || '',
        source: a.source || 'GDELT',
        published_at: a.seendate
          ? new Date(
              a.seendate.slice(0, 4) +
                '-' +
                a.seendate.slice(4, 6) +
                '-' +
                a.seendate.slice(6, 8) +
                'T12:00:00Z'
            ).toISOString()
          : new Date().toISOString(),
      }))
      .filter((a) => a.title && a.content && a.content.length >= 200)
  } catch {
    return []
  }
}