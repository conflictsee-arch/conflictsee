'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

const FILTERS = ['ALL', 'Pro-Israel', 'Pro-Iran', 'Neutral', 'Conflicted']

const STANCE_STYLES = {
  'pro-israel': { bg: '#eff6ff', text: '#1d4ed8', label: 'Pro-Israel' },
  'pro-iran': { bg: '#fef2f2', text: '#e53935', label: 'Pro-Iran' },
  'neutral': { bg: '#f3f4f6', text: '#6b7280', label: 'Neutral' },
  'conflicted': { bg: '#fffbeb', text: '#d97706', label: 'Conflicted' }
}

const getFlagEmoji = (code) => {
  if (!code) return '🏳️'
  return String.fromCodePoint(...code.split('').map(c => 127397 + c.charCodeAt(0)))
}

export default function WorldAffairsSection() {
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    async function fetchCountries() {
      setLoading(true)
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('impact_score', { ascending: false })
      
      if (!error && data) setCountries(data)
      setLoading(false)
    }
    
    fetchCountries()
    const id = setInterval(fetchCountries, 60000)
    return () => clearInterval(id)
  }, [])

  const filtered = filter === 'ALL'
    ? countries
    : countries.filter(c => c.stance?.toLowerCase() === filter.toLowerCase())

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, margin: "-80px" }}
      style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}
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
            03
          </span>
          <h2 style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 700, fontSize: '28px', color: '#111827', margin: 0, lineHeight: 1.2
          }}>
            World Affairs
          </h2>
          <p style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 400, fontSize: '14px', color: '#9ca3af', margin: '4px 0 0 0'
          }}>
            Country positions on the conflict
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const isActive = filter === f
            const fKey = f.toLowerCase()
            const baseBg = STANCE_STYLES[fKey]?.bg || '#f3f4f6'
            const baseText = STANCE_STYLES[fKey]?.text || '#6b7280'
            const activeBg = f === 'ALL' ? '#1a6b3c' : STANCE_STYLES[fKey]?.bg
            const activeText = f === 'ALL' ? '#ffffff' : STANCE_STYLES[fKey]?.text

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

      {/* TABLE DATA */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        overflowX: 'auto'
      }}>
        <div style={{ minWidth: '800px' }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(150px, 1.5fr) 120px 140px minmax(100px, 1fr) 240px',
            gap: '16px',
            background: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            padding: '12px 20px',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 500,
            fontSize: '11px',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <div>Country</div>
            <div>Stance</div>
            <div>Impact</div>
            <div>UN Vote</div>
            <div>Summary</div>
          </div>

          {/* Table Body */}
          {loading ? (
            <div>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="skeleton" style={{ height: '56px', borderBottom: '1px solid #f3f4f6' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '64px', textAlign: 'center', color: '#9ca3af', fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
              No countries found.
            </div>
          ) : (
            <div>
              {filtered.map((country, idx) => {
                const stanceKey = country.stance?.toLowerCase()
                const sStyle = STANCE_STYLES[stanceKey] || { bg: '#f3f4f6', text: '#6b7280', label: 'Unknown' }
                const score = country.impact_score || 0
                const fill = score >= 8 ? '#e53935' : score >= 5 ? '#f59e0b' : '#2d9e5f'

                return (
                  <motion.div
                    key={country.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut", delay: idx * 0.06 }}
                    viewport={{ once: true }}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(150px, 1.5fr) 120px 140px minmax(100px, 1fr) 240px',
                      gap: '16px',
                      padding: '16px 20px',
                      borderBottom: '1px solid #f3f4f6',
                      alignItems: 'center',
                      transition: 'background 0.15s ease',
                      cursor: 'default'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
                  >
                    {/* Col 1 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter), Inter, sans-serif', fontWeight: 500, fontSize: '14px', color: '#111827' }}>
                      <span style={{ fontSize: '18px' }}>{getFlagEmoji(country.code)}</span>
                      {country.name}
                    </div>

                    {/* Col 2 */}
                    <div>
                      <span style={{
                        background: sStyle.bg,
                        color: sStyle.text,
                        borderRadius: '999px',
                        padding: '3px 12px',
                        fontFamily: 'var(--font-inter), Inter, sans-serif',
                        fontWeight: 600,
                        fontSize: '11px'
                      }}>
                        {sStyle.label}
                      </span>
                    </div>

                    {/* Col 3 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="mono" style={{ fontSize: '14px', color: '#111827', minWidth: '20px' }}>
                        {score}
                      </span>
                      <div style={{ width: '80px', height: '4px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${score * 10}%`, background: fill, borderRadius: '999px' }} />
                      </div>
                    </div>

                    {/* Col 4 */}
                    <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontWeight: 400, fontSize: '13px', color: '#6b7280' }}>
                      {country.un_vote || '--'}
                    </div>

                    {/* Col 5 */}
                    <div style={{
                      fontFamily: 'var(--font-inter), Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '13px',
                      color: '#6b7280',
                      maxWidth: '240px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {country.summary || 'Summary unavailable.'}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  )
}
