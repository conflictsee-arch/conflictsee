// Article body extractor — fetches the real text from an article URL
// so thin feeds (Google News RSS) can still feed the timeline and news
// sections with full content. No key required; pure HTML → text.
const DISALLOWED_HOSTS = [
  'youtube.com', 'youtu.be', 'facebook.com', 'twitter.com', 'x.com',
  'instagram.com', 'tiktok.com', 'reddit.com', 'linkedin.com',
  'news.google.com', // JS redirect wrapper — cannot be resolved server-side
]

function stripTags(html) {
  return String(html || '')
    // remove scripts/styles
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    // strip tags
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x27;/g, "'")
    .replace(/&#8217;|&#039;/g, "'")
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '—')
    .replace(/\s+/g, ' ')
    .trim()
}

// Pick the text-heavy region of a page (rough but effective).
function extractMainText(text) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 60)
  if (!paragraphs.length) return text.slice(0, 3000)
  return paragraphs.slice(0, 15).join('\n\n').slice(0, 3000)
}

// Crude boilerplate stripping: drop leading nav/site-name lines and
// any line that's just a site name, menu item, or cookie notice.
const BOILERPLATE = [
  /^[|•·-]+$/,
  /^\s*newsletter\s*$/i,
  /^\s*subscribe\s*$/i,
  /^\s*cookie/i,
  /^\s*advertisement\s*$/i,
  /^\s*related stories?\s*$/i,
  /^\s*more stories?\s*$/i,
  /^\s*popular now\s*$/i,
  /^\s*trending\s*$/i,
  /^\s*menu\s*$/i,
  /^\s*home\s*$/i,
  /^\s*log in\s*$/i,
  /^\s*sign in\s*$/i,
  /^\s*sign up\s*$/i,
  /^\s*search\s*$/i,
  /^\s*terms of use\s*$/i,
  /^\s*privacy policy\s*$/i,
  /^\s*about us\s*$/i,
  /^\s*contact us\s*$/i,
]

function cleanBoilerplate(text) {
  const lines = String(text || '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => {
      if (!l) return false
      return !BOILERPLATE.some((re) => re.test(l))
    })
  return lines.join('\n')
}

export async function fetchArticleBody(url, maxChars = 3000) {
  if (!url) return ''
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    if (DISALLOWED_HOSTS.some((d) => host.includes(d))) return ''
  } catch {
    return ''
  }
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
    })
    if (!res.ok) return ''
    const html = await res.text()
    if (html.length > 2_000_000) return ''
    const text = stripTags(html)
    const main = extractMainText(text)
    return cleanBoilerplate(main).slice(0, maxChars)
  } catch {
    return ''
  }
}

// Fetch bodies for a list of articles (sequential to be gentle; cap count).
export async function enrichArticlesWithBodies(articles, { limit = 12, minChars = 200 } = {}) {
  let enriched = 0
  for (const a of articles) {
    if (enriched >= limit) break
    const needsBody = !a.content || a.content.length < minChars
    if (!needsBody || !a.url) continue
    const body = await fetchArticleBody(a.url)
    if (body && body.length >= minChars) {
      a.content = body
      a.body_fetched = true
      enriched++
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  return articles
}
