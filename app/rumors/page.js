'use client'

import { useState, useEffect, useCallback } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import { useCachedSupabase } from '@/components/ui/useCachedSupabase'
import SkeletonCard from '@/components/ui/SkeletonCard'
import SeverityPill from '@/components/ui/SeverityPill'
import CategoryPill from '@/components/ui/CategoryPill'
import { getWarDay } from '@/lib/constants'
import { RefreshCw, Loader2, AlertTriangle, ShieldAlert, Swords } from 'lucide-react'

const RUMOR_CATEGORY_COLORS = {
  intelligence: { bg: '#EFF6FF', color: '#1D4ED8' },
  nuclear: { bg: '#FAF5FF', color: '#7C3AED' },
  leadership: { bg: '#FEF2F2', color: '#BE123C' },
  military: { bg: '#FFF7ED', color: '#C2410C' },
  diplomatic: { bg: '#ECFDF5', color: '#047857' },
  'atrocity claims': { bg: '#FDF2F8', color: '#BE185D' },
}

const RUMOR_CATEGORIES = [
  'All',
  'Intelligence',
  'Nuclear',
  'Leadership',
  'Military',
  'Diplomatic',
  'Atrocity Claims',
]

const SEVERITIES = ['All', 'High', 'Medium', 'Low']

function timeAgo(isoString) {
  if (!isoString) return ''
  const diff = Date.now() - new Date(isoString).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function RumorsPage() {
  const [mounted, setMounted] = useState(false)
  const [warDay, setWarDay] = useState(28)
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState('')
  const [cat, setCat] = useState('All')
  const [severity, setSeverity] = useState('All')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    setMounted(true)
    setWarDay(getWarDay())
  }, [])

  const fetchRumorsFromDb = useCallback(async () => {
    const [newsRes, legacyRes] = await Promise.allSettled([
      supabase.from('rumors_news').select('*').order('published_at', { ascending: false }).limit(100),
      supabase.from('rumors').select('*').order('created_at', { ascending: false }).limit(100),
    ])

    const newsRows = (newsRes.status === 'fulfilled' && newsRes.value.data) || []
    const legacyRows = (legacyRes.status === 'fulfilled' && legacyRes.value.data) || []

    const normalized = legacyRows.map((r) => ({
      id: 'legacy-' + r.id,
      title: (r.title || r.headline || '').startsWith('UNVERIFIED')
        ? r.title || r.headline
        : 'UNVERIFIED: ' + (r.title || r.headline || ''),
      summary: r.detail || r.summary || r.description || '',
      detail: r.detail || r.summary || '',
      category: r.category || r.region || 'Intelligence',
      severity: r.confidence === 'High' ? 'High' : r.confidence === 'Medium' ? 'Medium' : 'Low',
      source: r.source_type || r.source || 'Telegram/OSINT',
      source_url: r.source_url || null,
      published_at: r.first_seen
        ? (r.first_seen.includes('T') ? r.first_seen : r.first_seen + 'T00:00:00Z')
        : r.created_at,
      verified: false,
    }))

    const seen = new Set()
    const merged = [...newsRows, ...normalized].filter((r) => {
      const k = (r.title || '').replace(/^unverified:\s*/i, '').toLowerCase().slice(0, 50)
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })

    merged.sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0))
    return merged
  }, [])

  // Cached first paint + background refresh every 5 min
  const { rows, loading, reload: loadRumors } = useCachedSupabase(
    'cs-cache-rumors',
    fetchRumorsFromDb,
    { refreshMs: 300000 }
  )

  async function handleFetch() {
    setFetching(true)
    setFetchError('')
    try {
      const res = await fetch('/api/process-news?type=rumors')
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || `Scan failed (${res.status})`)
      }
    } catch (e) {
      setFetchError(e.message || 'Scan failed — please try again')
    }
    await loadRumors()
    setFetching(false)
    if (fetchError) setTimeout(() => setFetchError(''), 5000)
  }

  const filtered = rows.filter((r) => {
    const matchCat = cat === 'All' || (r.category || '').toString().toLowerCase().includes(cat.toLowerCase())
    const matchSev = severity === 'All' || (r.severity || '').toString().toLowerCase() === severity.toLowerCase()
    return matchCat && matchSev
  })

  const highCount = rows.filter((r) => (r.severity || '').toString().toLowerCase() === 'high').length
  const unverifiedCount = rows.filter((r) => !r.verified).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px 0' }}>
        {/* ── PAGE TITLE (matches Economics page style) ────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontWeight: 800,
              fontSize: '28px',
              color: '#111827',
              margin: '0 0 6px',
            }}>Rumors &amp; Intel</h1>
            <p style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '14px',
              color: '#6B7280',
              margin: 0,
            }}>
              Unverified claims, anonymous sources &amp; disputed reports · treat as raw intel
              {mounted && (
                <span style={{
                  marginLeft: '10px',
                  background: '#FEF2F2',
                  color: '#DC2626',
                  borderRadius: '9999px',
                  padding: '1px 10px',
                  fontSize: '12px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}><Swords size={12} /> Day {warDay}</span>
              )}
            </p>
          </div>
          <button
            onClick={handleFetch}
            disabled={fetching}
            style={{
              borderRadius: '999px',
              border: '1.5px solid #e53935',
              background: '#FEF2F2',
              color: '#DC2626',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              cursor: fetching ? 'not-allowed' : 'pointer',
              opacity: fetching ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {fetching ? <><Loader2 size={14} className="spin" /> Scanning…</> : <><RefreshCw size={14} /> Scan Latest Intel</>}
          </button>
        </div>
        {fetchError && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '12px',
            padding: '10px 16px',
            marginBottom: '16px',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontSize: '13px',
            color: '#B91C1C',
          }}>⚠️ {fetchError}</div>
        )}

        {/* ── DANGER STAT STRIP ────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div className="card" style={{ padding: '16px 18px', borderTop: '3px solid #DC2626', borderRadius: '12px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: 700, color: '#DC2626', marginBottom: '6px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><AlertTriangle size={12} /> Reports Tracked</div>
            <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '24px', fontWeight: 700, color: '#111827' }}>{unverifiedCount}</div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#9CA3AF' }}>unverified reports</div>
          </div>
          <div className="card" style={{ padding: '16px 18px', borderTop: '3px solid #B91C1C', borderRadius: '12px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: 700, color: '#B91C1C', marginBottom: '6px' }}>🔴 High-Severity</div>
            <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '24px', fontWeight: 700, color: '#111827' }}>{highCount}</div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#9CA3AF' }}>most dangerous claims</div>
          </div>
          <div className="card" style={{ padding: '16px 18px', borderTop: '3px solid #DC2626', borderRadius: '12px' }}>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: 700, color: '#DC2626', marginBottom: '6px' }}>🗂 Intelligence Sources</div>
            <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '24px', fontWeight: 700, color: '#111827' }}>{rows.filter((r) => r.source).length}</div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#9CA3AF' }}>Telegram, OSINT & more</div>
          </div>
        </div>

        {/* ── WARNING BANNER ───────────────────────────────────────────────── */}
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: '12px',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
        }}>
          <span style={{ display: 'inline-flex', flexShrink: 0, marginTop: '2px', color: '#DC2626' }}><ShieldAlert size={22} /></span>
          <div>
            <div style={{ fontFamily: 'var(--font-inter)', fontWeight: 800, fontSize: '13px', color: '#B91C1C', marginBottom: '4px' }}>
              UNVERIFIED INTELLIGENCE — READ WITH CAUTION
            </div>
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12.5px', color: '#7F1D1D', lineHeight: 1.6 }}>
              These reports contain <strong>UNVERIFIED</strong> claims from anonymous sources, opposition groups, Telegram channels, or disputed accounts.
              ConflictSee does <strong>NOT</strong> independently verify these claims. Exercise critical judgement before sharing.
            </div>
          </div>
        </div>

        {/* ── FILTERS ──────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
          {RUMOR_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              style={{
                borderRadius: '9999px',
                border: `1.5px solid ${cat === c ? '#DC2626' : '#E5E7EB'}`,
                background: cat === c ? '#DC2626' : '#FFFFFF',
                color: cat === c ? '#FFFFFF' : '#374151',
                padding: '5px 14px',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >{c}</button>
          ))}
          <div style={{ width: '1px', height: '24px', background: '#E5E7EB', margin: '0 4px' }} />
          {SEVERITIES.map((s) => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              style={{
                borderRadius: '9999px',
                border: `1.5px solid ${severity === s ? '#1a6b3c' : '#E5E7EB'}`,
                background: severity === s ? '#1a6b3c' : '#FFFFFF',
                color: severity === s ? '#FFFFFF' : '#374151',
                padding: '5px 14px',
                fontSize: '12px',
                fontWeight: 600,
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >{s === 'All' ? 'Sev: All' : s}</button>
          ))}
        </div>

        {/* ── COUNTER ──────────────────────────────────────────────────────── */}
        <div style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#9CA3AF', marginBottom: '12px' }}>
          Showing <strong style={{ color: '#374151' }}>{filtered.length}</strong> of {rows.length} reports
          {rows.length > 0 && mounted && (() => {
            const latest = rows.reduce((a, b) =>
              (new Date(a.published_at || 0) > new Date(b.published_at || 0) ? a : b)).published_at
            return latest ? ` · updated ${timeAgo(latest)}` : ''
          })()}
        </div>

        {/* ── CARDS ────────────────────────────────────────────────────────── */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 40px', color: '#9CA3AF', fontFamily: 'var(--font-inter)', fontSize: '14px' }}>
            No unverified reports match these filters.{' '}
            <button onClick={handleFetch} style={{ background: 'none', border: 'none', color: '#DC2626', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><RefreshCw size={13} /> Scan Latest Intel</span>
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '60px' }}>
            {filtered.map((row) => {
              const isOpen = expanded === row.id
              const sev = (row.severity || 'medium').toString().toLowerCase()
              const borderColor = sev === 'high' ? '#DC2626' : sev === 'medium' ? '#D97706' : '#E5E7EB'
              return (
                <div
                  key={row.id}
                  className="card"
                  onClick={() => setExpanded(isOpen ? null : row.id)}
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s',
                    borderLeft: `4px solid ${borderColor}`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(220,38,38,0.12)')}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
                >
                  {/* Pills */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px', alignItems: 'center' }}>
                    <span style={{
                      background: '#DC2626', color: '#fff', borderRadius: '999px', padding: '2px 10px',
                      fontSize: '10px', fontWeight: 800, fontFamily: 'var(--font-inter)', letterSpacing: '0.5px',
                    }}>UNVERIFIED</span>
                    <SeverityPill severity={row.severity} />
                    {row.category && <CategoryPill category={row.category} map={RUMOR_CATEGORY_COLORS} />}
                  </div>

                  {/* Title */}
                  <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 6px', lineHeight: 1.4 }}>
                    {row.title}
                  </h3>

                  {/* Summary */}
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#6B7280', margin: '0 0 8px', lineHeight: 1.6 }}>
                    {row.summary}
                  </p>

                  {/* Expanded detail — intel file box */}
                  {isOpen && (
                    <div style={{
                      marginTop: '10px',
                      marginBottom: '12px',
                      padding: '12px 16px',
                      background: '#FDF2F2',
                      borderLeft: '2px solid #FCA5A5',
                      borderRadius: '0 8px 8px 0',
                    }}>
                      <div style={{
                        fontFamily: 'var(--font-inter)', fontSize: '11px', fontWeight: 800,
                        color: '#B91C1C', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px',
                      }}>
                        █ Full Intelligence Report
                      </div>
                      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#374151', margin: 0, lineHeight: 1.7 }}>
                        {row.detail || row.summary}
                      </p>
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid #F3F4F6',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#9CA3AF' }}>
                        📡 {row.source || 'Unknown'}
                      </span>
                      <span style={{ color: '#E5E7EB' }}>•</span>
                      <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: '#9CA3AF' }}>
                        {timeAgo(row.published_at)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {row.source_url ? (
                        <a
                          href={row.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: 600,
                            color: '#DC2626', textDecoration: 'none',
                            padding: '3px 10px', borderRadius: '6px',
                            border: '1px solid #FECACA', background: '#FFF5F5',
                            display: 'flex', alignItems: 'center', gap: '4px',
                          }}
                        >Source ↗</a>
                      ) : (
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#DC2626', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={11} /> Not verified
                        </span>
                      )}
                      <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: isOpen ? '#9CA3AF' : '#DC2626', fontWeight: 600 }}>
                        {isOpen ? '▲ Less' : '▼ More'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}