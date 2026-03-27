import { createClient } from '@supabase/supabase-js'
import { getTimelineGroqClient, TIMELINE_SYSTEM_PROMPT } from '@/lib/timelineGroq'
import { fetchTimelineNews } from '@/lib/timelineNews'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function GET() {
  console.log({
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasGroqKey1: !!process.env.GROQ_TIMELINE_KEY_1,
    hasGroqKey2: !!process.env.GROQ_TIMELINE_KEY_2,
    hasNewsData: !!process.env.NEWSDATA_KEY,
    hasGNews: !!process.env.GNEWS_KEY,
  })

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

    // 3. Process each article with Groq
    for (const article of articles) {
      // Skip if no content or too thin
      if (!article.content || article.content.length < 200) {
        console.log(`Skipping thin article: ${article.title?.slice(0, 30)}... (${article.content?.length || 0} chars)`)
        skipped++
        continue
      }

      try {
        const groq = getTimelineGroqClient()

        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          temperature: 0.1,
          max_tokens: 1000,
          messages: [
            { role: 'system', content: TIMELINE_SYSTEM_PROMPT },
            {
              role: 'user',
              content: `Article title: ${article.title}\n\nArticle content: ${article.content.slice(0, 2000)}`,
            },
          ],
        })

        const raw = completion.choices?.[0]?.message?.content?.trim()
        if (!raw) { 
          console.log(`Groq returned empty for ${article.title?.slice(0, 30)}...`)
          skipped++; 
          continue; 
        }

        // Parse JSON safely
        let parsed
        try {
          const jsonMatch = raw.match(/\{[\s\S]*\}/)
          parsed = JSON.parse(jsonMatch?.[0] || raw)
        } catch {
          skipped++
          continue
        }

        // Skip if Groq says not relevant
        if (parsed.skip) { 
          console.log(`Groq irrelevant: ${article.title?.slice(0, 30)}...`)
          skipped++; 
          continue; 
        }

        // Validate required fields and detail quality
        if (!parsed.title || !parsed.date || !parsed.bullets || parsed.bullets.length < 2) {
          console.log(`Skipping "${parsed.title || 'Untitled'}": < 2 bullets or missing fields`)
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
        const warStart = new Date('2026-02-28T00:00:00Z')
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
          source_url: parsed.source_url || article.url,
          verified: false,
          published_at: new Date(
            parsed.date + 'T' + (parsed.time || '12:00') + ':00Z'
          ).toISOString(),
          is_locked: false,
          created_at: new Date().toISOString(),
        })

        if (error) {
          errors++
        } else {
          inserted++
          results.push(parsed.title)
        }
      } catch (err) {
        errors++
        console.error('Groq error:', err.message)
      }
    }

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
    console.error('fetch-timeline ERROR:', error.message, error.stack)
    return Response.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

