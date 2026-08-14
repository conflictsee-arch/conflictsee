'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, RefreshCw, Newspaper, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import SkeletonCard from '@/components/ui/SkeletonCard'
import SeverityPill from '@/components/ui/SeverityPill'
import CategoryPill from '@/components/ui/CategoryPill'
import { timeAgo } from '@/components/ui/timeAgo'
import { ECO_CATEGORIES } from '@/app/economics/components/market-data'

const ECO_CATEGORY_COLORS = {
  'energy markets': { bg: '#FEF3C7', color: '#B45309' },
  'global economy': { bg: '#EFF6FF', color: '#1D4ED8' },
  'emerging markets': { bg: '#F0FDF4', color: '#15803D' },
  'sanctions': { bg: '#FEF2F2', color: '#DC2626' },
  'trade': { bg: '#F5F3FF', color: '#6D28D9' },
  'currency': { bg: '#ECFDF5', color: '#047857' },
}

export default function NewsTab() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [fetching, setFetching] = useState(false)
  const [events, setEvents] = useState([])

  const loadNews = useCallback(async () => {
    setLoading(true)
    const [newsRes, eventsRes] = await Promise.allSettled([
      supabase
        .from('economics_news')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(100),
      supabase
        .from('events')
        .select('id, headline, timestamp_ist, category')
        .order('timestamp_ist', { ascending: false })
        .limit(200),
    ])
    setRows((newsRes.status === 'fulfilled' && newsRes.value.data) || [])
    setEvents((eventsRes.status === 'fulfilled' && eventsRes.value.data) || [])
    setLoading(false)
  }, [])

  useEffect(() => {
    loadNews()
    const iv = setInterval(loadNews, 300_000)
    return () => clearInterval(iv)
  }, [loadNews])

  async function handleFetch() {
    setFetching(true)
    try {
      const res = await fetch('/api/process-news?type=economics')
      if (res.status === 429) {
        const j = await res.json().catch(() => ({}))
        console.warn(j.error || 'Rate limited')
      }
      await loadNews()
    } catch {}
    setFetching(false)
  }

  const filtered = cat === 'All' ? rows : rows.filter((r) => (r.category || '').toLowerCase() === cat.toLowerCase())

  // Find nearest war event within ±24h of the article's published_at
  const findRelatedEvent = (publishedAt) => {
    if (!publishedAt || events.length === 0) return null
    const t = new Date(publishedAt).getTime()
    let best = null
    let bestDiff = 24 * 60 * 60 * 1000 // 24h window
    for (const e of events) {
      const et = new Date(e.timestamp_ist || 0).getTime()
      if (!et) continue
      const diff = Math.abs(t - et)
      if (diff < bestDiff) {
        bestDiff = diff
        best = e
      }
    }
    return best
  }

  return (
    <div>
      {/* Controls Row */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
        {ECO_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            style={{
              borderRadius: '9999px',
              border: `1.5px solid ${cat === c ? '#1a6b3c' : '#E5E7EB'}`,
              background: cat === c ? '#1a6b3c' : '#FFFFFF',
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
        <button
          onClick={handleFetch}
          disabled={fetching}
          style={{
            borderRadius: '9999px',
            border: '1.5px solid #4caf7d',
            background: '#E8F5EE',
            color: '#1a6b3c',
            padding: '5px 16px',
            fontSize: '12px',
            fontWeight: 700,
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            cursor: fetching ? 'not-allowed' : 'pointer',
            marginLeft: 'auto',
            opacity: fetching ? 0.7 : 1,
            whiteSpace: 'nowrap',
          }}
        >{fetching ? <><Loader2 size={14} className="spin" /> Fetching…</> : <><RefreshCw size={14} /> Fetch Latest</>}</button>
      </div>

      {/* Article Cards */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 40px',
          color: '#9CA3AF',
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: '14px',
        }}>
          No economics articles yet.{' '}
          <button
            onClick={handleFetch}
            style={{ background: 'none', border: 'none', color: '#1a6b3c', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
          ><RefreshCw size={13} /> Fetch Latest</button>{' '}
          to pull live articles from news sources.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((row) => {
            const isOpen = expanded === row.id
            return (
              <div
                key={row.id}
                className="card"
                onClick={() => setExpanded(isOpen ? null : row.id)}
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                  borderLeft: '3px solid #1a6b3c',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
              >
                {/* Pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px', alignItems: 'center' }}>
                  <SeverityPill severity={row.severity} />
                  {row.category && <CategoryPill category={row.category} map={ECO_CATEGORY_COLORS} />}
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '0 0 6px',
                  lineHeight: 1.4,
                }}>{row.title}</h3>

                {/* Summary */}
                <p style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontSize: '13px',
                  color: '#6B7280',
                  margin: '0 0 10px',
                  lineHeight: 1.6,
                }}>{row.summary}</p>

                {/* Expanded Detail */}
                {isOpen && (
                  <>
                    <p style={{
                      fontFamily: 'var(--font-inter), Inter, sans-serif',
                      fontSize: '13px',
                      color: '#374151',
                      margin: '0 0 12px',
                      lineHeight: 1.7,
                      borderLeft: '2px solid #E5E7EB',
                      paddingLeft: '14px',
                    }}>{row.detail}</p>

                    {/* Related war event */}
                    {(() => {
                      const rel = findRelatedEvent(row.published_at)
                      if (!rel) return null
                      return (
                        <div style={{
                          background: '#F0FDF4',
                          border: '1px solid #D1FAE5',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          marginBottom: '12px',
                        }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Zap size={12} /> Related War Event</span>
                          <div style={{
                            fontFamily: 'var(--font-inter), Inter, sans-serif',
                            fontSize: '12.5px', color: '#374151', lineHeight: 1.5,
                          }}>
                            {rel.headline}
                            <a href="/timeline" style={{
                              color: '#1a6b3c', fontWeight: 700, textDecoration: 'none', marginLeft: '6px',
                            }}>View →</a>
                          </div>
                        </div>
                      )
                    })()}

                    {/* Amber war impact box */}
                    {row.war_impact_note && (
                      <div style={{
                        background: '#FFFBEB',
                        border: '1px solid #FDE68A',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        marginBottom: '12px',
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-inter), Inter, sans-serif',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#B45309',
                        }}><span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Zap size={12} /> War Impact: </span></span>
                        <span style={{
                          fontFamily: 'var(--font-inter), Inter, sans-serif',
                          fontSize: '12px',
                          color: '#92400E',
                        }}>{row.war_impact_note}</span>
                      </div>
                    )}
                  </>
                )}

                {/* Footer */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '10px',
                  borderTop: '1px solid #F3F4F6',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#9CA3AF', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Newspaper size={12} /> {row.source || 'Unknown'}
                    </span>
                    <span style={{ color: '#E5E7EB' }}>•</span>
                    <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: '#9CA3AF' }}>
                      {timeAgo(row.published_at)}
                    </span>
                  </div>
                  {row.source_url ? (
                    <a
                      href={row.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: 600,
                        color: '#1a6b3c', textDecoration: 'none',
                        padding: '3px 10px', borderRadius: '6px',
                        border: '1px solid #BBF7D0', background: '#F0FDF4',
                        display: 'flex', alignItems: 'center', gap: '4px',
                      }}
                    >
                      Read →
                    </a>
                  ) : (
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: isOpen ? '#9CA3AF' : '#1a6b3c', fontWeight: 600 }}>
                      {isOpen ? '▲ Less' : '▼ More'}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}