'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Clock, Calendar, Newspaper, RefreshCw, Loader2, Search } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useCachedSupabase } from '@/components/ui/useCachedSupabase'
import { WAR_START, WAR_START_ISO, getWarDay } from '@/lib/constants'

const TIMEZONES = [
  {
    id: 'IST',
    label: 'IST',
    flag: '🇮🇳',
    name: 'India',
    tz: 'Asia/Kolkata',
  },
  {
    id: 'EST',
    label: 'EST',
    flag: '🇺🇸',
    name: 'United States',
    tz: 'America/New_York',
  },
  {
    id: 'IRST',
    label: 'IRST',
    flag: '🇮🇷',
    name: 'Iran',
    tz: 'Asia/Tehran',
  },
  {
    id: 'ILT',
    label: 'ILT',
    flag: '🇮🇱',
    name: 'Israel',
    tz: 'Asia/Jerusalem',
  },
  {
    id: 'CET',
    label: 'CET',
    flag: '🇪🇺',
    name: 'Europe',
    tz: 'Europe/Berlin',
  },
]

function parseDescriptionPayload(description) {
  if (typeof description !== 'string') return { bullets: [], context_header: '', day_number: null }
  const trimmed = description.trim()
  if (!trimmed) return { bullets: [], context_header: '', day_number: null }

  // New format: description stored as JSON object { context_header, bullets, day_number }.
  if (trimmed.startsWith('{')) {
    try {
      const obj = JSON.parse(trimmed)
      return {
        bullets: Array.isArray(obj?.bullets) ? obj.bullets : [],
        context_header: typeof obj?.context_header === 'string' ? obj.context_header : '',
        day_number: typeof obj?.day_number === 'number' ? obj.day_number : null,
      }
    } catch {
      // Fall through
    }
  }

  // Legacy format: description stored as JSON array of bullets.
  if (trimmed.startsWith('[')) {
    try {
      const arr = JSON.parse(trimmed)
      return { bullets: Array.isArray(arr) ? arr : [], context_header: '', day_number: null }
    } catch {
      // Fall through
    }
  }

  // Plain text fallback.
  return { bullets: [trimmed], context_header: '', day_number: null }
}

function parseBullets(bullets, description) {
  // bullets can be stored as JSONB or as a string depending on Supabase serialization.
  if (Array.isArray(bullets)) return bullets

  if (typeof bullets === 'string') {
    try {
      const parsed = JSON.parse(bullets)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      // Fall through
    }
  }

  const payload = parseDescriptionPayload(description)
  if (payload.bullets?.length) return payload.bullets
  return ['No bullet details available.']
}

function getContextHeaderFromEvent(event) {
  if (typeof event?.context_header === 'string' && event.context_header.trim()) return event.context_header.trim()
  const payload = parseDescriptionPayload(event?.description)
  return payload.context_header || ''
}

function getCategoryBadgeClass(category) {
  const c = (category ?? '').toString().toLowerCase().trim()
  const map = {
    military: 'badge-military',
    diplomatic: 'badge-diplomatic',
    economic: 'badge-economic',
    humanitarian: 'badge-humanitarian',
    political: 'badge-political',
    nuclear: 'badge-nuclear',
    intelligence: 'badge-political',
    news: 'badge-news',
  }
  return `badge ${map[c] || 'badge-news'}`
}

function getSeverityBadgeClass(severity) {
  const s = (severity ?? '').toString().toLowerCase().trim()
  if (s === 'high') return 'badge badge-severity-high'
  if (s === 'medium') return 'badge badge-severity-medium'
  return 'badge badge-severity-low'
}

// DST-aware time conversion via Intl (IANA timezone names).
function convertTime(isoDateStr, timeZone) {
  if (!isoDateStr) return '—'
  const d = new Date(isoDateStr)
  if (!Number.isFinite(d.getTime())) return '—'
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone,
    }).formatToParts(d)
    const hour = parts.find((p) => p.type === 'hour')?.value ?? ''
    const minute = parts.find((p) => p.type === 'minute')?.value ?? ''
    const dayPeriod = parts.find((p) => p.type === 'dayPeriod')?.value ?? ''
    return `${hour}:${minute} ${dayPeriod}`.trim()
  } catch {
    return '—'
  }
}

function getDayNumberFromPublishedAt(publishedAt, mounted) {
  if (!mounted || !publishedAt) return ''
  const base = new Date('2026-02-28T00:00:00+05:30').getTime()
  const t = new Date(publishedAt).getTime()
  if (!Number.isFinite(base) || !Number.isFinite(t)) return ''
  const dayNumber = Math.floor((t - base) / 86400000) + 1
  return Number.isFinite(dayNumber) && dayNumber > 0 ? dayNumber : ''
}

function getDayNumberFromEvent(event, mounted) {
  if (typeof event?.day_number === 'number') return event.day_number
  const payload = parseDescriptionPayload(event?.description)
  if (typeof payload?.day_number === 'number') return payload.day_number
  return getDayNumberFromPublishedAt(event?.published_at, mounted)
}

function ExpandableBullet({ bullet }) {
  const [expanded, setExpanded] = useState(false)
  const [pinned, setPinned] = useState(false)

  const summary = typeof bullet === 'string' ? bullet : bullet?.summary
  const detail = typeof bullet === 'object' ? bullet?.detail : null

  const hasDetail = typeof detail === 'string' && detail.trim()

  return (
    <li
      onClick={() => {
        if (!hasDetail) return
        setPinned(prev => {
          const next = !prev
          setExpanded(next)
          return next
        })
      }}
      onMouseEnter={() => {
        if (!hasDetail || pinned) return
        setExpanded(true)
      }}
      onMouseLeave={() => {
        if (!hasDetail || pinned) return
        setExpanded(false)
      }}
      style={{
        listStyle: 'none',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        lineHeight: 1.65,
        marginBottom: '6px',
        paddingLeft: '4px',
        position: 'relative',
        cursor: hasDetail ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <span style={{
          color: hasDetail ? 'var(--accent-primary)' : 'var(--timeline-arrow)',
          fontWeight: 700,
          fontSize: '14px',
          marginTop: '1px',
          transition: 'transform 0.2s',
          transform: expanded ? 'rotate(90deg)' : 'none',
          flexShrink: 0,
          userSelect: 'none',
        }}>
          ›
        </span>
        <div>
          <span style={{ fontWeight: hasDetail ? 500 : 400 }}>
            {summary}
          </span>

          {hasDetail && expanded && (
            <div style={{
              marginTop: '6px',
              padding: '8px 12px',
              background: 'var(--timeline-detail-bg)',
              borderLeft: `2px solid var(--accent-primary)`,
              borderRadius: '0 6px 6px 0',
              fontSize: '12px',
              color: 'var(--timeline-detail-text)',
              lineHeight: 1.7,
              animation: 'fadeIn 0.2s ease',
            }}>
              {detail}
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

export default function TimelineSection() {
  const [mounted, setMounted] = useState(false)
  const [activeTimezone, setActiveTimezone] = useState(TIMEZONES[0])
  const [fetching, setFetching] = useState(false)
  const [fetchMsg, setFetchMsg] = useState('')
  const [currentDay, setCurrentDay] = useState(28) // Safe server default
  const [search, setSearch] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  useEffect(() => {
    setMounted(true)
    setCurrentDay(getWarDay())
  }, [])

  const fetchEventsFromDb = useCallback(async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(200)
    if (error) throw error
    return data || []
  }, [])

  // Cached first paint (localStorage) + background refresh every 5 min
  const { rows: events, loading, loadError, reload: fetchEvents } = useCachedSupabase(
    'cs-cache-events',
    fetchEventsFromDb,
    { refreshMs: 300_000 }
  )

  const handleFetchLatest = async () => {
    setFetching(true)
    setFetchMsg('Searching latest war news...')
    try {
      const res = await fetch('/api/fetch-timeline')
      const json = await res.json()
      if (res.status === 429) {
        setFetchMsg(json.error || 'Too many requests — please wait a minute')
      } else if (json.inserted > 0) {
        setFetchMsg(`✓ ${json.inserted} new events added`)
        fetchEvents()
      } else {
        setFetchMsg('No new events found')
      }
    } catch {
      setFetchMsg('Error fetching news')
    }
    setFetching(false)
    setTimeout(() => setFetchMsg(''), 4000)
  }

  // Search + date-range filter over loaded events
  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase()
    const from = fromDate ? new Date(fromDate + 'T00:00:00Z').getTime() : null
    const to = toDate ? new Date(toDate + 'T23:59:59Z').getTime() : null
    return events.filter((event) => {
      if (from != null || to != null) {
        const t = new Date(event.published_at).getTime()
        if (!Number.isFinite(t)) return false
        if (from != null && t < from) return false
        if (to != null && t > to) return false
      }
      if (!q) return true
      const hay = [
        event?.title,
        event?.headline,
        event?.source,
        event?.category,
        getContextHeaderFromEvent(event),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [events, search, fromDate, toDate])

  const groupedEvents = useMemo(() => {
    if (!mounted) return {}
    return filteredEvents.reduce((groups, event) => {
      const dateKey = new Date(event.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      })
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(event)
      return groups
    }, {})
  }, [filteredEvents, mounted])

  const sortedDays = useMemo(() => {
    const days = Object.keys(groupedEvents)
    return days.sort((a, b) => {
      const aFirst = groupedEvents[a]?.[0]?.published_at
      const bFirst = groupedEvents[b]?.[0]?.published_at
      return (bFirst ? new Date(bFirst).getTime() : 0) - (aFirst ? new Date(aFirst).getTime() : 0)
    })
  }, [groupedEvents])

  return (
    <section style={{
      maxWidth: '860px',
      margin: '0 auto',
      width: '100%',
      padding: '60px 24px',
      fontFamily: 'var(--font-inter), Inter, sans-serif',
    }}>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '16px',
        marginBottom: '32px',
        flexWrap: 'wrap',
      }}>
        <div>
          <h2 style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 700,
            fontSize: '28px',
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.2,
          }}>
            Conflict Timeline
          </h2>
          <p style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: 'var(--text-muted)',
            margin: '8px 0 0 0',
          }}>
            Hour-by-hour coverage · Feb 28–Present
            {mounted && events.length > 0 && (() => {
              const latest = events.reduce((a, b) =>
                (new Date(a.published_at || 0) > new Date(b.published_at || 0) ? a : b)).published_at
              const mins = Math.max(0, Math.round((Date.now() - new Date(latest).getTime()) / 60000))
              const label = mins < 1 ? 'just now' : mins < 60 ? `${mins}m ago` : `${Math.floor(mins / 60)}h ago`
              return ` · updated ${label}`
            })()}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleFetchLatest}
            disabled={fetching}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '999px',
              border: '1.5px solid var(--accent-primary)',
              background: 'transparent',
              color: 'var(--accent-primary)',
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              cursor: fetching ? 'wait' : 'pointer',
              opacity: fetching ? 0.6 : 1,
              transition: 'all 0.15s ease',
            }}
          >
            {fetching ? <Loader2 size={13} strokeWidth={2.5} className="spin" /> : <RefreshCw size={13} strokeWidth={2.5} />} {fetching ? 'Fetching...' : 'Fetch Latest News'}
          </button>
          {fetchMsg && (
            <span style={{
              fontSize: '12px',
              color: fetchMsg.startsWith('✓') ? '#15803D' : fetchMsg.startsWith('Error') ? '#DC2626' : 'var(--text-muted)',
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontWeight: 500,
            }}>{fetchMsg}</span>
          )}
          <span style={{
            background: 'var(--accent-soft)',
            color: 'var(--accent-primary)',
            borderRadius: '999px',
            padding: '4px 14px',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}>
            {filteredEvents.length} Events
          </span>
        </div>
      </div>

      {/* Timezone switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 0 28px 0',
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontSize: '12px',
          color: 'var(--text-muted)',
          fontWeight: 600,
          marginRight: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          Time Zone:
        </span>

        {TIMEZONES.map(tz => (
          <button
            key={tz.id}
            onClick={() => setActiveTimezone(tz)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 14px',
              borderRadius: '999px',
              border: activeTimezone.id === tz.id
                ? '1.5px solid var(--accent-primary)'
                : '1.5px solid var(--border)',
              background: activeTimezone.id === tz.id
                ? 'var(--accent-soft)'
                : 'var(--bg-card)',
              cursor: 'pointer',
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '13px',
              fontWeight: activeTimezone.id === tz.id ? 700 : 400,
              color: activeTimezone.id === tz.id ? 'var(--accent-primary)' : 'var(--text-muted)',
              transition: 'all 0.15s ease',
            }}
          >
            <span>{tz.flag}</span>
            <span>{tz.id}</span>
          </button>
        ))}
      </div>

      {/* ── SEARCH + DATE FILTER ─────────────── */}
      <div style={{
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        marginBottom: '8px',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flex: '1 1 220px',
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          borderRadius: '999px',
          padding: '7px 14px',
        }}>
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, sources, categories…"
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              width: '100%',
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '13px',
              color: 'var(--text-primary)',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '14px', padding: 0 }}
              aria-label="Clear search"
            >✕</button>
          )}
        </div>
        <input
          type="date"
          value={fromDate}
          min={WAR_START_ISO}
          onChange={(e) => setFromDate(e.target.value)}
          style={{
            border: '1.5px solid var(--border)',
            borderRadius: '999px',
            padding: '7px 12px',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontSize: '12px',
            color: 'var(--text-muted)',
            background: 'var(--bg-card)',
          }}
          aria-label="From date"
        />
        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>→</span>
        <input
          type="date"
          value={toDate}
          min={WAR_START_ISO}
          onChange={(e) => setToDate(e.target.value)}
          style={{
            border: '1.5px solid var(--border)',
            borderRadius: '999px',
            padding: '7px 12px',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontSize: '12px',
            color: 'var(--text-muted)',
            background: 'var(--bg-card)',
          }}
          aria-label="To date"
        />
        {(search || fromDate || toDate) && (
          <button
            onClick={() => { setSearch(''); setFromDate(''); setToDate('') }}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--accent-primary)',
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >Clear</button>
        )}
      </div>
      {(search || fromDate || toDate) && (
        <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 12px 2px' }}>
          {filteredEvents.length} of {events.length} events match
        </p>
      )}

      {/* ── CONTENT ──────────────────────────── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton" style={{ height: '120px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : loadError ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: '16px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-muted)' }}>
            Unable to load timeline
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            There was an error fetching events. Please try again.
          </p>
          <button
            onClick={() => { fetchEvents() }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '999px',
              border: '1.5px solid var(--accent-primary)',
              background: 'transparent',
              color: 'var(--accent-primary)',
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          ><RefreshCw size={13} strokeWidth={2.5} /> Retry</button>
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>📭</div>
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: '16px', fontWeight: 500, marginBottom: '8px', color: 'var(--text-muted)' }}>
            No events yet
          </p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            The timeline will populate automatically when new verified events arrive.
          </p>
        </div>
      ) : (
        <div>
          {sortedDays.map(day => {
            const dayEvents = groupedEvents[day] || []
            const sortedDayEvents = dayEvents
              .slice()
              .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

            const firstEvent = sortedDayEvents[0]
            const dayNumber = getDayNumberFromEvent(firstEvent, mounted)
            const dayContextHeader = getContextHeaderFromEvent(firstEvent)

            return (
              <div key={day}>
                <div style={{
                  borderTop: '3px solid var(--accent-primary)',
                  paddingTop: '24px',
                  marginTop: '48px',
                  marginBottom: '24px',
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                }}>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    lineHeight: 1.35,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <Calendar size={19} strokeWidth={2.2} style={{ color: 'var(--accent-primary)' }} />
                    <span>{day}</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>
                      {' '}
                      — Day {mounted ? dayNumber : currentDay}
                    </span>
                  </div>

                  {!!dayContextHeader && (
                    <p style={{
                      fontFamily: 'var(--font-inter), Inter, sans-serif',
                      fontSize: '13px',
                      color: 'var(--status-neutral)',
                      fontStyle: 'italic',
                      marginTop: '4px',
                      lineHeight: 1.5,
                    }}>
                      {dayContextHeader}
                    </p>
                  )}
                </div>

                <div className="day-events-container">
                  {sortedDayEvents.map(event => {
                    const bullets = parseBullets(event?.bullets, event?.description)
                    const severityLower = (event?.severity ?? '').toString().toLowerCase().trim()

                    const borderLeftColor =
                      severityLower === 'high'
                        ? 'var(--status-high-text)'
                        : severityLower === 'medium'
                          ? 'var(--status-medium-text)'
                          : 'var(--accent-primary)'

                    const categoryLabel = (event?.category ?? '').toString().toUpperCase().trim() || 'NEWS'
                    const severityLabel = (event?.severity ?? 'Medium').toString().toUpperCase().trim() || 'MEDIUM'
                    const contextHeader = getContextHeaderFromEvent(event)
                    const displayTime = convertTime(event?.published_at, activeTimezone.tz)

                    return (
                      <div
                        key={event.id}
                        className="timeline-event-card"
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--timeline-card-border)',
                          borderLeft: `3px solid ${borderLeftColor}`,
                          borderRadius: '16px',
                          padding: '20px 24px',
                          marginBottom: '16px',
                          marginLeft: '24px',
                          position: 'relative',
                        }}
                      >
                        {/* TIME */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '14px',
                        }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent-primary)',
                            width: '22px',
                            height: '22px',
                            flexShrink: 0,
                          }}>
                            <Clock size={20} strokeWidth={2.2} />
                          </span>
                          <span style={{
                            fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                            fontSize: '17px',
                            fontWeight: 700,
                            color: 'var(--accent-primary)',
                            letterSpacing: '0.5px',
                          }}>
                            {displayTime} {activeTimezone.label}
                          </span>
                        </div>

                        {/* BADGES */}
                        <div style={{
                          display: 'flex',
                          gap: '6px',
                          flexWrap: 'wrap',
                          marginBottom: '10px',
                        }}>
                          {(() => {
                            const catLower = (event?.category ?? '').toLowerCase().trim()
                            const catColors = {
                              military: { bg: '#EFF6FF', color: '#1D4ED8' },
                              economic: { bg: '#F5F3FF', color: '#6D28D9' },
                              political: { bg: '#FFFBEB', color: '#B45309' },
                              humanitarian: { bg: '#FFF1F2', color: '#BE123C' },
                              diplomatic: { bg: '#F0FDFA', color: '#0F766E' },
                            }
                            const catStyle = catColors[catLower] || { bg: '#F3F4F6', color: '#374151' }
                            return (
                              <span style={{
                                background: catStyle.bg,
                                color: catStyle.color,
                                padding: '2px 10px',
                                borderRadius: '9999px',
                                fontSize: '11px',
                                fontWeight: 500,
                                fontFamily: 'var(--font-inter), Inter, sans-serif',
                                display: 'inline-flex',
                                alignItems: 'center',
                              }}>
                                {(event?.category ?? 'News').charAt(0).toUpperCase() + (event?.category ?? 'News').slice(1).toLowerCase()}
                              </span>
                            )
                          })()}
                          {(() => {
                            const sevLower = (event?.severity ?? '').toLowerCase().trim()
                            const sevColors = {
                              high: { bg: '#FEF2F2', color: '#DC2626', fontWeight: 700 },
                              medium: { bg: '#FFFBEB', color: '#D97706', fontWeight: 500 },
                              low: { bg: '#F0FDF4', color: '#16A34A', fontWeight: 500 },
                            }
                            const sevStyle = sevColors[sevLower] || sevColors.medium
                            return (
                              <span style={{
                                background: sevStyle.bg,
                                color: sevStyle.color,
                                padding: '2px 10px',
                                borderRadius: '9999px',
                                fontSize: '11px',
                                fontWeight: sevStyle.fontWeight,
                                fontFamily: 'var(--font-inter), Inter, sans-serif',
                                display: 'inline-flex',
                                alignItems: 'center',
                              }}>
                                {(event?.severity ?? 'Medium').charAt(0).toUpperCase() + (event?.severity ?? 'Medium').slice(1).toLowerCase()}
                              </span>
                            )
                          })()}
                          {event?.verified && (
                            <span style={{
                              background: '#F0FDF4',
                              color: '#15803D',
                              padding: '2px 10px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: 500,
                              fontFamily: 'var(--font-inter), Inter, sans-serif',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}>
                              ✓ Verified
                            </span>
                          )}
                        </div>

                        {/* TITLE */}
                        <h3 style={{
                          fontFamily: 'var(--font-inter), Inter, sans-serif',
                          fontSize: '16px',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          margin: '0 0 6px 0',
                          lineHeight: 1.4,
                        }}>
                          {event?.title || event?.headline || 'Untitled'}
                        </h3>

                        {/* CONTEXT HEADER */}
                        {!!contextHeader && (
                          <p style={{
                            fontFamily: 'var(--font-inter), Inter, sans-serif',
                            fontSize: '13px',
                            color: 'var(--status-neutral)',
                            fontStyle: 'italic',
                            margin: '0 0 14px 0',
                            lineHeight: 1.5,
                          }}>
                            {contextHeader}
                          </p>
                        )}

                        {/* BULLETS */}
                        <ul style={{
                          margin: '0 0 16px 0',
                          padding: 0,
                          borderLeft: '2px solid var(--timeline-day-line)',
                          paddingLeft: '14px',
                        }}>
                          {bullets.map((bullet, i) => (
                            <ExpandableBullet
                              key={`${event.id}-b-${i}`}
                              bullet={bullet}
                            />
                          ))}
                        </ul>

                        {/* CARD FOOTER */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '12px',
                          borderTop: '1px solid var(--timeline-footer-border)',
                          gap: '12px',
                          flexWrap: 'wrap',
                        }}>
                          <span style={{
                            fontFamily: 'var(--font-inter), Inter, sans-serif',
                            fontSize: '12px',
                            color: 'var(--text-muted)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                          }}>
                            <Newspaper size={13} strokeWidth={2} /> {event?.source || 'Unknown'}
                          </span>

                          {event?.source_url && (
                            <a
                              href={event.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                fontFamily: 'var(--font-inter), Inter, sans-serif',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: 'var(--accent-primary)',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--read-more-border)',
                                background: 'var(--read-more-bg)',
                                transition: 'var(--read-more-transition)',
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              Read more →
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
