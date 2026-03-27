import Groq from 'groq-sdk'

// ─────────────────────────────
// KEY RESOLVER WITH FALLBACKS
// If a key is not set, falls back
// to the existing TIMELINE KEY 1
// so project never breaks
// ─────────────────────────────
const resolveKey = (envKey) => {
  const val = process.env[envKey]
  if (!val || val.startsWith('[')) return process.env.GROQ_TIMELINE_KEY_1
  return val
}

// ─────────────────────────────
// TIMELINE CLIENT
// 2 keys with auto-fallback
// ─────────────────────────────
export async function timelineGroq(
  prompt,
  attempt = 0
) {
  const keys = [
    resolveKey('GROQ_TIMELINE_KEY_1'),
    resolveKey('GROQ_TIMELINE_KEY_2')
  ]

  if (!keys[attempt]) {
    throw new Error(
      `GROQ Timeline KEY ${attempt + 1}
       not configured`
    )
  }

  try {
    const groq = new Groq({
      apiKey: keys[attempt]
    })

    const response = await groq
      .chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 6000,
        temperature: 0.3,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })

    console.log(
      `✅ Timeline KEY ${attempt + 1}
       succeeded`
    )
    return response.choices[0]
      .message.content

  } catch (err) {
    // Rate limited — try KEY 2
    if (err.status === 429
      && attempt === 0) {
      console.log(
        '⚠️ KEY 1 rate limited — switching to KEY 2'
      )
      await new Promise(r =>
        setTimeout(r, 2000)
      )
      return timelineGroq(prompt, 1)
    }

    if (attempt === 1) {
      console.error(
        '❌ Both Timeline keys exhausted'
      )
    }
    throw err
  }
}

// ─────────────────────────────
// ECONOMICS CLIENT (KEY 3)
// Falls back to KEY 1 if not set
// ─────────────────────────────
export function economicsGroq() {
  return new Groq({
    apiKey: resolveKey(
      'GROQ_ECONOMICS_KEY'
    )
  })
}

// ─────────────────────────────
// WORLD AFFAIRS CLIENT (KEY 4)
// Falls back to KEY 1 if not set
// ─────────────────────────────
export function worldAffairsGroq() {
  return new Groq({
    apiKey: resolveKey(
      'GROQ_WORLDAFFAIRS_KEY'
    )
  })
}

// ─────────────────────────────
// RUMORS CLIENT (KEY 5)
// Falls back to KEY 1 if not set
// ─────────────────────────────
export function rumorsGroq() {
  return new Groq({
    apiKey: resolveKey(
      'GROQ_RUMORS_KEY'
    )
  })
}

// ─────────────────────────────
// SAFE CALL WRAPPER
// Handles rate limits for all
// single-key section clients
// ─────────────────────────────
export async function safeGroqCall(
  groqClient,
  prompt,
  maxTokens = 2000
) {
  try {
    const response = await groqClient
      .chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: maxTokens,
        temperature: 0.4,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    return response.choices[0]
      .message.content

  } catch (err) {
    if (err.status === 429) {
      console.warn(
        '⚠️ Rate limit hit — waiting 10 seconds...'
      )
      await new Promise(r =>
        setTimeout(r, 10000)
      )
      // Retry once after wait
      const retry = await groqClient
        .chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          max_tokens: maxTokens,
          temperature: 0.4,
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      return retry.choices[0]
        .message.content
    }
    throw err
  }
}
