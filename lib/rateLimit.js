// Lightweight in-memory rate limiter for public API routes.
// Protects paid/rate-limited upstream quotas (Groq, NewsData, Alpha Vantage)
// from abuse while keeping client-side refresh buttons functional.
// Per-deployment-instance memory — sufficient as a public deterrent.

const buckets = new Map()

function cleanup() {
  const now = Date.now()
  for (const [key, entry] of buckets.entries()) {
    if (now > entry.resetAt) buckets.delete(key)
  }
}

/**
 * @param {string} ipKey - per-client identifier (IP or similar)
 * @param {number} limit - max requests allowed per window
 * @param {number} windowMs - window length in milliseconds
 * @returns {{ ok: boolean, remaining: number, retryAfterSec?: number }}
 */
export function rateLimit(ipKey, limit, windowMs) {
  cleanup()
  const now = Date.now()
  const key = `${ipKey}:${Math.floor(now / windowMs)}`
  const entry = buckets.get(key) || { count: 0, resetAt: now + windowMs }
  entry.count += 1
  buckets.set(key, entry)
  if (entry.count > limit) {
    return { ok: false, remaining: 0, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) }
  }
  return { ok: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

/** Best-effort client IP from request headers. */
export function clientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
