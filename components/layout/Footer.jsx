'use client'

import { useState, useEffect } from 'react'
import { Swords, Fuel, TrendingUp } from 'lucide-react'

const WAR_START = new Date('2026-02-28T00:00:00Z')

export default function Footer() {
  const [mounted, setMounted] = useState(false)
  const [warDay, setWarDay] = useState(1)
  const [markets, setMarkets] = useState(null)
  const [year, setYear] = useState('')

  useEffect(() => {
    setMounted(true)
    setYear(String(new Date().getFullYear()))
    setWarDay(Math.floor((new Date() - WAR_START) / 86400000) + 1)
    fetch('/api/live-markets')
      .then((r) => r.json())
      .then(setMarkets)
      .catch(() => {})
  }, [])

  const brent = markets?.oil?.brent
  const spy = markets?.markets?.find((m) => m.symbol === 'SPY')
  const sensex = markets?.markets?.find((m) => m.symbol === 'SENSEX.XBOM')

  const sections = [
    { label: 'Timeline', href: '/timeline' },
    { label: 'Economics', href: '/economics' },
    { label: 'World Affairs', href: '/world-affairs' },
    { label: 'Rumors', href: '/rumors' },
  ]

  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e5e7eb',
      padding: '40px 32px',
      marginTop: '64px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Live market strip ─────────────────────────────────────────── */}
        {mounted && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            padding: '12px 18px',
            background: '#F0FDF4',
            border: '1px solid #D1FAE5',
            borderRadius: '12px',
            marginBottom: '32px',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: 800, color: '#1a6b3c' }}>
              <span className="pulse-dot" style={{ width: '7px', height: '7px', background: '#2d9e5f' }} /> LIVE
            </span>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Swords size={13} strokeWidth={2} /> War Day {warDay}
            </span>
            <span style={{ color: '#E5E7EB' }}>|</span>
            {brent && (
              <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', color: '#111827', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <Fuel size={13} strokeWidth={2} style={{ color: '#1a6b3c' }} /> Brent ${parseFloat(brent.price).toFixed(2)}
                <span style={{ color: parseFloat(brent.change_pct) >= 0 ? '#2d9e5f' : '#c96a6a', marginLeft: '4px' }}>
                  {parseFloat(brent.change_pct) >= 0 ? '▲' : '▼'}{Math.abs(parseFloat(brent.change_pct)).toFixed(2)}%
                </span>
              </span>
            )}
            {spy && (
              <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', color: '#111827', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <TrendingUp size={13} strokeWidth={2} style={{ color: '#1a6b3c' }} /> S&P {parseFloat(spy.close).toFixed(2)}
                <span style={{ color: parseFloat(spy.change_pct) >= 0 ? '#2d9e5f' : '#c96a6a', marginLeft: '4px' }}>
                  {parseFloat(spy.change_pct) >= 0 ? '▲' : '▼'}{Math.abs(parseFloat(spy.change_pct)).toFixed(2)}%
                </span>
              </span>
            )}
            {sensex && (
              <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', color: '#111827' }}>
                🇮🇳 Sensex {parseFloat(sensex.close).toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#9CA3AF' }}>
              auto-refreshes every 5 min
            </span>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px'
        }}>
          {/* Column 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px',
                background: '#1a6b3c',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '12px' }}>CS</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: '16px', color: '#1a6b3c' }}>ConflictSee</span>
            </div>
            <p style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '13px',
              color: '#6b7280',
              lineHeight: 1.6
            }}>
              Real-time Iran-Israel war intelligence dashboard. Timeline, markets, world stances and raw intel — updated live.
            </p>
            {mounted && (
              <span style={{
                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                fontSize: '11px',
                color: '#1a6b3c',
                background: '#E8F5EE',
                padding: '3px 10px',
                borderRadius: '999px',
                alignSelf: 'flex-start',
              }}>
                DAY {warDay} · WAR STARTED FEB 28, 2026
              </span>
            )}
          </div>

          {/* Column 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontWeight: 600, fontSize: '13px', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sections</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sections.map(link => (
                <a key={link.label} href={link.href} style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontSize: '14px',
                  color: '#6b7280',
                  textDecoration: 'none',
                }} className="footer-link">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ fontWeight: 600, fontSize: '13px', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Data & Sources</h4>
            <p style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '13px',
              color: '#6b7280',
              lineHeight: 1.6
            }}>
              News from NewsData &amp; GNews · AI analysis via Groq · prices from OilpriceAPI, Yahoo Finance &amp; ExchangeRate-API.
              Prices are indicative only. Rumor-section claims are unverified.
            </p>
            <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
              <span style={{
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                fontSize: '12px',
                color: '#9ca3af',
              }}>
                © {year || new Date().getFullYear()} ConflictSee. All rights reserved.
              </span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}