'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const FILTERS = ['ALL', 'Military', 'Diplomatic', 'Economic', 'Humanitarian', 'Nuclear']

const CAT_COLORS = {
  Military: '#e53935',
  Diplomatic: '#1d4ed8',
  Economic: '#15803d',
  Humanitarian: '#d97706',
  Nuclear: '#7c3aed'
}

export default function TimelineSection() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      
      if (!error && data) setEvents(data)
      setLoading(false)
    }
    
    fetchEvents()
    const id = setInterval(fetchEvents, 60000)
    return () => clearInterval(id)
  }, [])

  const filtered = filter === 'ALL' 
    ? events 
    : events.filter(e => e.category?.toLowerCase() === filter.toLowerCase())

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-80px" }}
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      {/* SECTION HEADER */}
      <div style={{ position: 'relative', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Left Side */}
        <div style={{ position: 'relative', paddingTop: '16px' }}>
          <span style={{
            position: 'absolute',
            top: -16,
            left: -8,
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 800,
            fontSize: '80px',
            color: '#f3f4f6',
            lineHeight: 1,
            zIndex: -1,
            userSelect: 'none'
          }}>
            01
          </span>
          <h2 style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 700,
            fontSize: '28px',
            color: '#111827',
            margin: 0,
            lineHeight: 1.2
          }}>
            Conflict Timeline
          </h2>
          <p style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: '#9ca3af',
            margin: '4px 0 0 0'
          }}>
            Live events — newest first
          </p>
        </div>

        {/* Right Side: Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const isActive = filter === f
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: isActive ? '#1a6b3c' : '#f3f4f6',
                  color: isActive ? '#ffffff' : '#6b7280',
                  borderRadius: '999px',
                  padding: '6px 16px',
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontWeight: 500,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {f}
              </button>
            )
          })}
        </div>
      </div>

      {/* CONTENT LOGIC */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton" style={{ height: '90px', borderRadius: '16px' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '64px', textAlign: 'center' }}>
          <Clock size={32} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
          <p style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontWeight: 500, fontSize: '16px', color: '#9ca3af', margin: 0 }}>
            No events logged yet
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((ev, index) => {
            const catColor = CAT_COLORS[ev.category] || '#e5e7eb'
            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e5e7eb',
                  borderLeft: `4px solid ${catColor}`,
                  padding: '20px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* TOP ROW */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span className={`badge badge-${ev.category?.toLowerCase() || 'monitoring'}`}>
                      {ev.category}
                    </span>
                    <span className={`badge badge-${ev.fact_check_status === 'verified' ? 'verified' : 'unconfirmed'}`}>
                      {ev.fact_check_status === 'verified' ? '✓ Verified' : '⚠️ Unconfirmed'}
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {ev.timestamp_ist}
                  </span>
                </div>

                {/* MIDDLE */}
                <h3 style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#111827',
                  margin: '8px 0 4px 0',
                  lineHeight: 1.4
                }}>
                  {ev.headline}
                </h3>

                {/* BOTTOM ROW */}
                {(ev.description || ev.source) && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginTop: '4px' }}>
                    <p style={{
                      fontFamily: 'var(--font-inter), Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '13px',
                      color: '#6b7280',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      flex: 1,
                      lineHeight: 1.5
                    }}>
                      {ev.description}
                    </p>
                    {ev.source && (
                      <span style={{
                        fontFamily: 'var(--font-inter), Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '12px',
                        color: '#9ca3af',
                        whiteSpace: 'nowrap'
                      }}>
                        via {ev.source}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.section>
  )
}
