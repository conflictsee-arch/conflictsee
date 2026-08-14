// Minimal structured logger for cron/API routes.
// Emits one JSON line per event so failures are greppable in Vercel logs.
// Usage: logInfo('fetch-timeline', 'groq_429', { retry_after: 120, key: 'K1' })

function line(route, event, extra = {}) {
  const base = { ts: new Date().toISOString(), route, event }
  try {
    console.log(JSON.stringify({ ...base, ...extra }))
  } catch {
    console.log(JSON.stringify(base))
  }
}

export function logInfo(route, event, extra) { line(route, event, extra) }

export function logError(route, event, err, extra = {}) {
  const base = {
    ts: new Date().toISOString(),
    route,
    event,
    level: 'error',
    message: err?.message || String(err),
    stack: err?.stack?.split('\n').slice(0, 3).join(' | '),
  }
  try {
    console.error(JSON.stringify({ ...base, ...extra }))
  } catch {
    console.error(JSON.stringify(base))
  }
}