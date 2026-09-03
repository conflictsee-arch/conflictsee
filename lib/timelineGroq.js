import Groq from 'groq-sdk'
import { groqWithPool } from '@/lib/groqClients'

// Timeline uses its dedicated key (KEY_1) with the shared backup (KEY_4)
const keys = [
  process.env.GROQ_TIMELINE_KEY_1,
  process.env.GROQ_KEY_ORG_4,
].filter(Boolean)

let currentIndex = 0

export function getTimelineGroqClient() {
  if (!keys.length) throw new Error('No GROQ_TIMELINE keys configured')
  const key = keys[currentIndex % keys.length]
  currentIndex++
  return new Groq({ apiKey: key })
}

// Prompt → Groq via the timeline-dedicated key pool (KEY_1 → KEY_4 backup)
export async function runTimelineGroq(prompt) {
  return groqWithPool.timeline(prompt, 6000, 0.3)
}

// Full chat-completions call via the timeline key pool (KEY_1 → KEY_4 backup)
export async function runTimelineGroqMessages(messages, maxTokens = 1000, temperature = 0.1) {
  return callTimelineMessages(messages, maxTokens, temperature)
}

// Per-call timeout so one hanging Groq request can't stall ingestion.
const TIMELINE_CALL_TIMEOUT_MS = 45000

function withTimeout(promise, ms = TIMELINE_CALL_TIMEOUT_MS) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timeline Groq call timed out after ${ms}ms`)), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

async function callTimelineMessages(messages, maxTokens, temperature) {
  const pool = [
    process.env.GROQ_TIMELINE_KEY_1,
    process.env.GROQ_KEY_ORG_4,
  ].filter(Boolean)
  if (!pool.length) throw new Error('No GROQ_TIMELINE keys configured')
  let lastErr = null
  for (const key of pool) {
    try {
      const client = new Groq({ apiKey: key })
      const res = await withTimeout(client.chat.completions.create({
        model: 'groq/compound',
        max_tokens: maxTokens,
        temperature: temperature,
        messages,
      }))
      return res.choices?.[0]?.message?.content?.trim() || ''
    } catch (err) {
      lastErr = err
      if (err.status === 429) {
        await new Promise((r) => setTimeout(r, 1500))
        continue
      }
      throw err
    }
  }
  throw lastErr || new Error('All timeline keys exhausted')
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
