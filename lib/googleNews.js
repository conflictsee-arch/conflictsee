// Google News RSS — free, no key, real-time headlines.
// Descriptions contain only source attribution HTML, so we keep
// title/url/publishedAt and fall back to the title as thin content.
const GOOGLE_RSS_URL =
  'https://news.google.com/rss/search?hl=en-US&gl=US&ceid=US:en'

function stripHtml(s) {
  return String(s || '')
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseRss(xml) {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) || []
  return items.map((raw) => {
    const titleMatch = raw.match(/<title>([\s\S]*?)<\/title>/)
    const linkMatch = raw.match(/<link>([\s\S]*?)<\/link>/)
    const dateMatch = raw.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
    const descMatch = raw.match(/<description>([\s\S]*?)<\/description>/)
    const sourceMatch = raw.match(/<source[^>]*>([\s\S]*?)<\/source>/)
    const title = stripHtml(titleMatch?.[1] || '')
    const desc = stripHtml(descMatch?.[1]).slice(0, 300) || ''
    // Google descriptions are just "<b>Source</b>&nbsp;&nbsp;<a href=...>"
    // attribution HTML. Extract the REAL source article URL from the anchor.
    const realUrl = (descMatch?.[1] || '').match(/href="([^"]+)"/)?.[1]
    const sourceUrl = realUrl || stripHtml(linkMatch?.[1] || '')
    return {
      title,
      // RSS has no body — Groq works from the headline + source
      content: title,
      url: sourceUrl,
      source: stripHtml(sourceMatch?.[1]) || 'Google News',
      published_at: new Date(stripHtml(dateMatch?.[1])).toISOString() || '',
      _google_desc: desc,
    }
  }).filter((a) => a.title && a.url)
}

export async function fetchGoogleNews(query, limit = 15) {
  try {
    const url = `${GOOGLE_RSS_URL}&q=${encodeURIComponent(query)}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) return []
    const xml = await res.text()
    const articles = parseRss(xml)
    const seen = new Set()
    return articles
      .filter((a) => {
        const k = a.title.toLowerCase().slice(0, 40)
        if (seen.has(k)) return false
        seen.add(k)
        return true
      })
      .slice(0, limit)
  } catch {
    return []
  }
}
