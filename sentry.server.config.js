// Sentry server (Node.js) config
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.SENTRY_DSN
if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: process.env.SENTRY_TRACING === 'true' ? 0.1 : 0,
  })
}