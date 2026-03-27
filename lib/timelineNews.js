const SEARCH_QUERIES = [
  'Iran Israel war strikes',
  'IRGC Israel missile attack',
  'Iran US war ceasefire',
  'Iran nuclear Israel bomb',
  'Hezbollah Israel Lebanon war',
  'Hormuz strait oil tanker',
  'Iran protest regime war',
]

function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

export async function fetchTimelineNews() {
  const query = SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)]

  const [newsDataRes, gNewsRes] = await Promise.allSettled([
    fetch(
      `https://newsdata.io/api/1/news?` +
      `apikey=${process.env.NEWSDATA_KEY}` +
      `&q=${encodeURIComponent(query)}` +
      `&language=en`
    ).then(r => r.json()),

    fetch(
      `https://gnews.io/api/v4/search?` +
      `q=${encodeURIComponent(query)}` +
      `&lang=en` +
      `&max=5` +
      `&from=${getYesterday()}` +
      `&token=${process.env.GNEWS_KEY}`
    ).then(r => r.json()),
  ])

  const articles = []

  // Extract from NewsData SAFELY
  if (newsDataRes.status === 'fulfilled') {
    const data = newsDataRes.value
    
    // Log what we actually got
    console.log('NewsData response:', 
      JSON.stringify(data).slice(0,200))
    
    // Check it has results array
    if (data?.results && 
      Array.isArray(data.results)) {
      for (const a of data.results) {
        articles.push({
          title: a.title || '',
          content: (a.content || 
            a.description || '').slice(0,2000),
          url: a.link || '',
          source: a.source_id || 'NewsData',
          publishedAt: a.pubDate
        })
      }
    } else {
      // API returned error — log it
      console.warn('NewsData error:', 
        data?.message || 
        data?.status || 
        'Unknown error')
    }
  }

  // Extract from GNews SAFELY
  if (gNewsRes.status === 'fulfilled') {
    const data = gNewsRes.value
    
    console.log('GNews response:', 
      JSON.stringify(data).slice(0,200))
    
    if (data?.articles && 
      Array.isArray(data.articles)) {
      for (const a of data.articles) {
        articles.push({
          title: a.title || '',
          content: (a.content || 
            a.description || '').slice(0,2000),
          url: a.url || '',
          source: a.source?.name || 'GNews',
          publishedAt: a.publishedAt
        })
      }
    } else {
      console.warn('GNews error:', 
        data?.errors || 
        data?.message || 
        'Unknown error')
    }
  }

  // If BOTH failed, throw helpful error
  if (articles.length === 0) {
    console.warn(
      'Both news sources returned 0 articles'
    )
    // Don't crash — return empty array
    // Route will handle gracefully
  }

  // Deduplicate by title similarity
  const seen = new Set()
  return articles.filter(a => {
    const key = a.title.toLowerCase().slice(0, 40)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
