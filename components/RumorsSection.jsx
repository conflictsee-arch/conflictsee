'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

const FILTERS = ['ALL', 'MONITORING', 'VERIFIED', 'DEBUNKED']

const STATUS_STYLES = {
  'MONITORING': { bg: '#fffbeb', text: '#d97706', border: '#fcd34d', label: 'Monitoring' },
  'VERIFIED': { bg: '#f0fdf4', text: '#15803d', border: '#4caf7d', label: 'Verified' },
  'DEBUNKED': { bg: '#fef2f2', text: '#e53935', border: '#f87171', label: 'Debunked' }
}

export default function RumorsSection() {
  const [rumors, setRumors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    async function fetchRumors() {
      setLoading(true)
      const { data, error } = await supabase
        .from('rumors')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data) setRumors(data)
      setLoading(false)
    }
    
    fetchRumors()
    const id = setInterval(fetchRumors, 60000)
    return () => clearInterval(id)
  }, [])

  const filtered = filter === 'ALL'
    ? rumors
    : rumors.filter(r => r.status?.toUpperCase() === filter)

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-80px" }}
      style={{ width: '100%' }}
    >
      {/* SECTION HEADER */}
      <div style={{ position: 'relative', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ position: 'relative', paddingTop: '16px' }}>
          <span style={{
            position: 'absolute', top: -16, left: -8,
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 800, fontSize: '80px', color: '#f3f4f6',
            lineHeight: 1, zIndex: -1, userSelect: 'none'
          }}>
            04
          </span>
          <h2 style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 700, fontSize: '28px', color: '#111827', margin: 0, lineHeight: 1.2
          }}>
            Rumors & Intel
          </h2>
          <p style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 400, fontSize: '14px', color: '#9ca3af', margin: '4px 0 0 0'
          }}>
            Unverified claims — AI fact-checked
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const isActive = filter === f
            const fKey = f.toUpperCase()
            const baseBg = STATUS_STYLES[fKey]?.bg || '#f3f4f6'
            const baseText = STATUS_STYLES[fKey]?.text || '#6b7280'
            const activeBg = f === 'ALL' ? '#1a6b3c' : STATUS_STYLES[fKey]?.bg
            const activeText = f === 'ALL' ? '#ffffff' : STATUS_STYLES[fKey]?.text

            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: isActive ? activeBg : '#f9fafb',
                  color: isActive ? activeText : '#9ca3af',
                  borderRadius: '999px',
                  padding: '6px 16px',
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '13px',
                  border: `1px solid ${isActive ? activeBg : '#e5e7eb'}`,
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
        <div className="rumor-grid">
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton" style={{ height: '200px', borderRadius: '20px' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '64px', textAlign: 'center', color: '#9ca3af', fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
          No rumors logged yet
        </div>
      ) : (
        <div className="rumor-grid">
          {filtered.map((r, index) => {
            const statusKey = r.status?.toUpperCase()
            const sStyle = STATUS_STYLES[statusKey] || { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb', label: 'Unknown' }
            
            // Handle groq_reasoning whether it's an array or string
            let reasoning = []
            if (r.groq_reasoning) {
              if (Array.isArray(r.groq_reasoning)) {
                reasoning = r.groq_reasoning.slice(0, 3)
              } else if (typeof r.groq_reasoning === 'string') {
                try {
                  const parsed = JSON.parse(r.groq_reasoning)
                  reasoning = Array.isArray(parsed) ? parsed.slice(0, 3) : [r.groq_reasoning]
                } catch {
                  reasoning = [r.groq_reasoning]
                }
              }
            }

            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '24px',
                  border: `1.5px solid ${sStyle.border}`,
                  transition: 'all 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* ROW 1 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    background: sStyle.bg,
                    color: sStyle.text,
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '11px',
                    textTransform: 'uppercase'
                  }}>
                    {sStyle.label}
                  </span>
                  <span className="mono" style={{ fontSize: '11px', color: '#9ca3af' }}>
                    {new Date(r.created_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                {/* ROW 2 */}
                <h3 style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#111827',
                  margin: '12px 0 6px 0',
                  lineHeight: 1.4
                }}>
                  {r.headline}
                </h3>

                {/* ROW 3 */}
                {r.description && (
                  <p style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '13px',
                    color: '#6b7280',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.5
                  }}>
                    {r.description}
                  </p>
                )}

                {/* ROW 4 - AI Box */}
                {reasoning.length > 0 && (
                  <div style={{
                    background: '#f9fafb',
                    borderRadius: '10px',
                    padding: '14px',
                    marginTop: '12px',
                    flex: '1' // push bottom row down
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-inter), Inter, sans-serif',
                      fontWeight: 700,
                      fontSize: '10px',
                      color: '#1a6b3c',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '8px'
                    }}>
                      🤖 AI Analysis
                    </div>
                    {reasoning.map((point, pi) => (
                      <div key={pi} style={{
                        fontFamily: 'var(--font-inter), Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '12px',
                        color: '#374151',
                        marginBottom: pi < reasoning.length - 1 ? '4px' : '0'
                      }}>
                        • {point}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Fallback to push bottom if no AI box */}
                {reasoning.length === 0 && <div style={{ flex: 1 }} />}

                {/* ROW 5 */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '12px',
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  color: '#9ca3af'
                }}>
                  <span>📡 {r.reddit_count || 0} Reddit signals</span>
                  <span>{r.source_count || 0} sources tracked</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <style>{`
        .rumor-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 768px) {
          .rumor-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </motion.section>
  )
}
