// Currents API — free tier ~250 requests/day, real-time (no 12h delay).
// Primary fresh source for the news sections.
const CURRENTS_URL = 'https://api.currentsapi.services/v1/search'

export async function fetchCurrentsNews(query, limit = 10) {
  if (!process.env.CURRENTS_KEY) return []
  try {
    const url =
      `${CURRENTS_URL}?apiKey=${process.env.CURRENTS_KEY}` +
      `&keywords=${encodeURIComponent(query)}` +
      `&language=en` +
      `&limit=${limit}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) return []
    const j = await res.json().catch(() => null)
    const articles = j?.news || []
    return articles
      .map((a) => ({
        title: a.title || '',
        content: (a.description || a.title || '').slice(0, 2000),
        url: a.url || '',
        source: a.author || 'Currents',
        published_at: a.published
          ? new Date(a.published).toISOString()
          : new Date().toISOString(),
      }))
      .filter((a) => a.title)
  } catch {
    return []
  }
}