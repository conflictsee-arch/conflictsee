/** @type {import('next').NextConfig} */
const nextConfig = {}

const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(nextConfig, {
  org: 'conflictsee',
  project: 'javascript-nextjs',
  // Source maps are uploaded only when SENTRY_AUTH_TOKEN + SENTRY_ORG/SENTRY_PROJECT are set.
  silent: !process.env.SENTRY_AUTH_TOKEN,
  disableLogger: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
})