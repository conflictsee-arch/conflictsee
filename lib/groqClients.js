import Groq from 'groq-sdk'

// ─────────────────────────────
// GROQ KEY POOLS (per section)
// Each section gets its own key
// so it has a dedicated daily
// budget. A 4th key (ORG_4) is
// the shared backup used when a
// section's key hits its limit.
//
//   timeline       → KEY_1
//   economics      → KEY_2 (ORG_2)
//   world/rumors   → KEY_3 (ORG_3)
//   backup (all)   → KEY_4 (ORG_4)
// ─────────────────────────────
const PRIMARY_KEY = process.env.GROQ_TIMELINE_KEY_1
const ECONOMICS_KEY = process.env.GROQ_KEY_ORG_2
const WAR_KEY = process.env.GROQ_KEY_ORG_3
const BACKUP_KEY = process.env.GROQ_KEY_ORG_4

// Models per pool
// NOTE: Groq removed `llama-3.3-70b-versatile` (404 model_not_found).
// Tested replacements on these keys: `groq/compound` extracts war events
// reliably with clean JSON; `gpt-oss-120b/20b` are too conservative (skip
// legitimate events); `qwen/qwen3.6-27b` emits thinking-trace text.
export const SECTION_MODELS = {
  timeline: 'groq/compound',
  economics: 'groq/compound',
  world_affairs: 'groq/compound',
  rumors: 'groq/compound',
  backfill: 'groq/compound',
}

export const KEY_POOLS = {
  timeline: [PRIMARY_KEY, BACKUP_KEY],
  economics: [ECONOMICS_KEY, BACKUP_KEY],
  world_affairs: [WAR_KEY, BACKUP_KEY],
  rumors: [WAR_KEY, BACKUP_KEY],
  backfill: [BACKUP_KEY, PRIMARY_KEY, ECONOMICS_KEY, WAR_KEY],
}

// Legacy/general fallback order (kept for safeGroqCall etc.)
const ALL_KEYS = [...new Set([PRIMARY_KEY, ECONOMICS_KEY, WAR_KEY, BACKUP_KEY])].filter(Boolean)

if (ALL_KEYS.length === 0) {
  console.warn('No GROQ keys configured. Groq calls will fail.')
}

function newClient(key) {
  return new Groq({ apiKey: key })
}

async function singleCall(client, prompt, maxTokens, temperature, model) {
  const res = await client.chat.completions.create({
    model: model || 'groq/compound',
    max_tokens: maxTokens,
    temperature: temperature,
    messages: [{ role: 'user', content: prompt }],
  })
  return res.choices?.[0]?.message?.content || ''
}

async function callPool(pool, prompt, maxTokens, temperature, model) {
  const keys = pool.filter(Boolean)
  if (!keys.length) throw new Error('No GROQ keys in pool')
  let lastErr = null
  for (const key of keys) {
    try {
      return await singleCall(newClient(key), prompt, maxTokens, temperature, model)
    } catch (err) {
      lastErr = err
      if (err.status === 429) {
        await new Promise((r) => setTimeout(r, 1500))
        continue
      }
      throw err
    }
  }
  throw lastErr || new Error('All keys in pool exhausted')
}

// Section-specific fallback helpers
export const groqWithPool = {
  timeline: (prompt, maxTokens = 6000, temperature = 0.3) =>
    callPool(KEY_POOLS.timeline, prompt, maxTokens, temperature, SECTION_MODELS.timeline),
  economics: (prompt, maxTokens = 2000, temperature = 0.4) =>
    callPool(KEY_POOLS.economics, prompt, maxTokens, temperature, SECTION_MODELS.economics),
  world_affairs: (prompt, maxTokens = 2000, temperature = 0.4) =>
    callPool(KEY_POOLS.world_affairs, prompt, maxTokens, temperature, SECTION_MODELS.world_affairs),
  rumors: (prompt, maxTokens = 2000, temperature = 0.4) =>
    callPool(KEY_POOLS.rumors, prompt, maxTokens, temperature, SECTION_MODELS.rumors),
  backfill: (prompt, maxTokens = 1200, temperature = 0.3) =>
    callPool(KEY_POOLS.backfill, prompt, maxTokens, temperature, SECTION_MODELS.backfill),
}

// General fallback (all keys)
export async function groqWithFallback(prompt, maxTokens = 2000, temperature = 0.3) {
  if (ALL_KEYS.length === 0) throw new Error('No GROQ keys configured')
  let lastErr = null
  for (const key of ALL_KEYS) {
    try {
      return await singleCall(newClient(key), prompt, maxTokens, temperature, 'groq/compound')
    } catch (err) {
      lastErr = err
      if (err.status === 429) {
        await new Promise((r) => setTimeout(r, 1500))
        continue
      }
      throw err
    }
  }
  throw lastErr || new Error('All Groq keys exhausted')
}

// ─────────────────────────────
// LEGACY CLIENTS (kept for
// backward compatibility with
// existing call sites)
// ─────────────────────────────
export async function timelineGroq(prompt, attempt = 0) {
  return groqWithPool.timeline(prompt, 6000, 0.3)
}

export function economicsGroq() {
  return { chat: { completions: { create: (opts) => groqWithPool.economics(opts.messages?.[0]?.content || '', opts.max_tokens || 2000, opts.temperature ?? 0.4) } } }
}

export function worldAffairsGroq() {
  return { chat: { completions: { create: (opts) => groqWithPool.world_affairs(opts.messages?.[0]?.content || '', opts.max_tokens || 2000, opts.temperature ?? 0.4) } } }
}

export function rumorsGroq() {
  return { chat: { completions: { create: (opts) => groqWithPool.rumors(opts.messages?.[0]?.content || '', opts.max_tokens || 2000, opts.temperature ?? 0.4) } } }
}

export async function safeGroqCall(client, prompt, maxTokens = 2000) {
  return groqWithPool.backfill(prompt, maxTokens, 0.4)
}
