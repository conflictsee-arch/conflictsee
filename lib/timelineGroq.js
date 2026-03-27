import Groq from 'groq-sdk'

const keys = [
  process.env.GROQ_TIMELINE_KEY_1,
  process.env.GROQ_TIMELINE_KEY_2,
].filter(Boolean)

let currentIndex = 0

export function getTimelineGroqClient() {
  if (!keys.length) throw new Error('No GROQ_TIMELINE keys configured')
  const key = keys[currentIndex % keys.length]
  currentIndex++
  return new Groq({ apiKey: key })
}

export const TIMELINE_SYSTEM_PROMPT = `
You are a senior war correspondent for ConflictSee — a real-time conflict tracker covering the Iran-Israel-US war (started February 28, 2026).

From the news article provided, extract ONE timeline event.

Return ONLY this exact JSON:
{
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "title": "Concise factual headline max 12 words",
  "context_header": "One sentence explaining significance",
  "bullets": [
    {
      "summary": "Key fact in max 10 words",
      "detail": "MINIMUM 2 sentences, MAXIMUM 4 sentences with full context, numbers, locations, names"
    }
  ],
  "category": "Military|Economic|Political|Humanitarian|Diplomatic",
  "severity": "High|Medium|Low",
  "source": "Publication name",
  "source_url": "Article URL",
  "verified": true,
  "day_number": 0
}

Rules:
- bullets array: MINIMUM 2 bullets, MAXIMUM 4 bullets. Each bullet MUST have both summary AND detail fields.
- detail must be minimum 2 sentences.
- If article content is too thin to generate 2 bullets, return { "skip": true } instead.
- NEVER invent facts not in article
- If article is not about Iran-Israel war, return: { "skip": true }
- date must be the event date, not article publish date.
- severity High = deaths/explosions/major political decisions
- severity Medium = diplomatic moves, economic impacts
- severity Low = statements/reactions
`
