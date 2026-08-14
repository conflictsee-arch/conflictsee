'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'
import {
  getUniqueCountryStances,
  getStanceLookup,
} from '@/lib/countryStances'
import WorldStanceMap from '@/components/world-affairs/WorldStanceMap'
import { Swords, RefreshCw, Loader2, Newspaper } from 'lucide-react'

const WAR_START = new Date('2026-02-28T00:00:00Z')

const NEWS_CATEGORIES = [
  'All',
  'Great Power Politics',
  'NATO-Europe',
  'Diplomacy',
  'Humanitarian',
  'Lebanon',
  'Regional Actors',
  'South Asia',
  'Islamic World',
]

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

function Pill({ label, color, bg, border }) {
  return (
    <span style={{
      background: bg,
      color,
      border: border ? `1px solid ${border}` : 'none',
      padding: '2px 10px',
      borderRadius: '9999px',
      fontSize: '11px',
      fontWeight: 600,
      fontFamily: 'var(--font-inter), Inter, sans-serif',
      display: 'inline-flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
    }}>{label}</span>
  )
}

function SeverityPill({ severity }) {
  const s = (severity || 'medium').toString().toLowerCase()
  const map = {
    high:   { bg: '#FEF2F2', color: '#DC2626' },
    medium: { bg: '#FFFBEB', color: '#D97706' },
    low:    { bg: '#F0FDF4', color: '#16A34A' },
  }
  const st = map[s] || map.medium
  return <Pill label={s.charAt(0).toUpperCase() + s.slice(1)} {...st} />
}

function CategoryPill({ category }) {
  const map = {
    'great power politics': { bg: '#F5F3FF', color: '#6D28D9' },
    'nato-europe':          { bg: '#EFF6FF', color: '#1D4ED8' },
    'diplomacy':            { bg: '#ECFDF5', color: '#047857' },
    'humanitarian':         { bg: '#FDF2F8', color: '#BE185D' },
    'lebanon':              { bg: '#FEF3C7', color: '#B45309' },
    'regional actors':      { bg: '#F0FDF4', color: '#15803D' },
    'south asia':           { bg: '#FEF2F2', color: '#DC2626' },
    'islamic world':        { bg: '#F8FAFC', color: '#334155' },
  }
  const key = (category || '').toString().toLowerCase()
  const st = map[key] || { bg: '#F3F4F6', color: '#374151' }
  return <Pill label={category || 'General'} {...st} />
}

function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        <div style={{ height: '20px', width: '80px', background: '#E5E7EB', borderRadius: '999px', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '20px', width: '60px', background: '#F3F4F6', borderRadius: '999px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <div style={{ height: '16px', width: '78%', background: '#E5E7EB', borderRadius: '6px', marginBottom: '8px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: '12px', width: '92%', background: '#F3F4F6', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: '12px', width: '55%', background: '#F3F4F6', borderRadius: '4px', marginTop: '6px', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  )
}

export default function WorldAffairsPage() {
  const [mounted, setMounted] = useState(false)
  const [warDay, setWarDay] = useState(28)
  const [news, setNews] = useState([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [fetching, setFetching] = useState(false)
  const [cat, setCat] = useState('All')
  const [expandedNews, setExpandedNews] = useState(null)

  useEffect(() => {
    setMounted(true)
    setWarDay(Math.floor((new Date() - WAR_START) / 86400000) + 1)
  }, [])

  const countries = useMemo(() => getUniqueCountryStances(), [])
  const stanceLookup = useMemo(() => getStanceLookup(), [])

  const loadData = useCallback(async () => {
    const newsRes = await Promise.allSettled([
      supabase.from('world_affairs_news').select('*').order('published_at', { ascending: false }).limit(100),
    ])
    setNews((newsRes[0].status === 'fulfilled' && newsRes[0].value.data) || [])
    setLoadingNews(false)
  }, [])

  useEffect(() => {
    loadData()
    const iv = setInterval(loadData, 300000)
    return () => clearInterval(iv)
  }, [loadData])

  async function handleFetch() {
    setFetching(true)
    try {
      const res = await fetch('/api/process-news?type=world_affairs')
      if (res.status === 429) {
        const j = await res.json().catch(() => ({}))
        console.warn(j.error || 'Rate limited')
      }
    } catch {}
    await loadData()
    setFetching(false)
  }

  const filteredNews = news.filter((n) => {
    if (cat === 'All') return true
    const c = (n.category || '').toString().toLowerCase()
    const countries = (n.countries || []).join(' ').toLowerCase()
    return c.includes(cat.toLowerCase()) || countries.includes(cat.toLowerCase())
  })

  const totalCountries = countries.length

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
            }}>World Affairs</h1>
            <p style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '14px',
              color: '#6B7280',
              margin: 0,
            }}>
              Every country&apos;s position on the Iran–Israel war · {totalCountries} nations tracked
              {mounted && (
                <span style={{
                  marginLeft: '10px',
                  background: '#E8F5EE',
                  color: '#1a6b3c',
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
              border: '1.5px solid #4caf7d',
              background: '#E8F5EE',
              color: '#1a6b3c',
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
            {fetching ? <><Loader2 size={14} className="spin" /> Fetching…</> : <><RefreshCw size={14} /> Refresh Intel</>}
          </button>
        </div>

        {/* ── GLOBAL ALIGNMENT MAP ─────────────────────────────────────────── */}
        <div style={{ marginBottom: '24px' }}>
          <WorldStanceMap countries={countries} stanceLookup={stanceLookup} />
        </div>

        {/* ── DIPLOMATIC NEWS FEED (like economics news cards) ─────────────── */}
        <div style={{ paddingBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontFamily: 'var(--font-inter)', fontWeight: 800, fontSize: '19px', color: '#111827', margin: 0 }}>
              Diplomatic News Feed
            </h2>
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#9CA3AF' }}>AI-curated world affairs developments</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
            {NEWS_CATEGORIES.map((c) => (
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
          </div>

          {loadingNews ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredNews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 40px', color: '#9CA3AF', fontFamily: 'var(--font-inter)', fontSize: '14px', background: '#fff', borderRadius: '16px', border: '1px solid var(--border)' }}>
              No diplomatic developments match these filters.{' '}
              <button onClick={handleFetch} style={{ background: 'none', border: 'none', color: '#1a6b3c', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><RefreshCw size={13} /> Refresh Intel</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredNews.map((n) => {
                const isOpen = expandedNews === n.id
                return (
                  <div
                    key={n.id}
                    className="card"
                    onClick={() => setExpandedNews(isOpen ? null : n.id)}
                    style={{
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'box-shadow 0.2s',
                      borderLeft: '3px solid #1a6b3c',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '')}
                  >
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px', alignItems: 'center' }}>
                      <SeverityPill severity={n.severity} />
                      {n.category && <CategoryPill category={n.category} />}
                      {(n.countries || []).slice(0, 3).map((co) => (
                        <Pill key={co} label={co} bg="#EFF6FF" color="#1D4ED8" />
                      ))}
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-inter)', fontSize: '16px', fontWeight: 700, color: '#111827', margin: '0 0 6px', lineHeight: 1.4 }}>
                      {n.title}
                    </h3>

                    <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#6B7280', margin: '0 0 10px', lineHeight: 1.6 }}>
                      {n.summary}
                    </p>

                    {isOpen && n.detail && (
                      <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#374151', margin: '0 0 12px', lineHeight: 1.7, borderLeft: '2px solid #E5E7EB', paddingLeft: '14px' }}>
                        {n.detail}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F3F4F6', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#9CA3AF', display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Newspaper size={12} /> {n.source || 'Unknown'}</span>
                        <span style={{ color: '#E5E7EB' }}>•</span>
                        <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: '#9CA3AF' }}>{timeAgo(n.published_at)}</span>
                      </div>
                      {n.source_url ? (
                        <a
                          href={n.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontFamily: 'var(--font-inter)', fontSize: '12px', fontWeight: 600,
                            color: '#1a6b3c', textDecoration: 'none',
                            padding: '3px 10px', borderRadius: '6px',
                            border: '1px solid #BBF7D0', background: '#F0FDF4',
                            display: 'flex', alignItems: 'center', gap: '4px',
                          }}
                        >Read →</a>
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
      </div>

      <Footer />
    </div>
  )
}