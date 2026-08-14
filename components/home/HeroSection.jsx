'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getUniqueCountryStances } from '@/lib/countryStances'

const COUNTRIES_TRACKED = getUniqueCountryStances().length

export default function HeroSection() {
  const [time, setTime] = useState('')
  const [mounted, setMounted] = useState(false)
  const [eventCount, setEventCount] = useState(null)
  const [rumorCount, setRumorCount] = useState(null)

  const [dayCount, setDayCount] = useState(28) // Safe server default
  useEffect(() => {
    setMounted(true)
    const warStart = new Date('2026-02-28T00:00:00Z')
    const update = () => {
      const now = new Date()
      // Time update
      const ist = new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZone: 'Asia/Kolkata',
      }).format(now)
      setTime(ist)

      // Day update
      const d = Math.floor((now - warStart) / (1000 * 60 * 60 * 24)) + 1
      setDayCount(d > 0 ? d : 1)
    }
    update()
    const id = setInterval(update, 1000)

    const loadCounts = async () => {
      try {
        const [events, rumorsNews, rumors] = await Promise.all([
          supabase.from('events').select('id', { count: 'exact', head: true }),
          supabase.from('rumors_news').select('id', { count: 'exact', head: true }),
          supabase.from('rumors').select('id', { count: 'exact', head: true }),
        ])
        setEventCount(events.count)
        setRumorCount((rumorsNews.count ?? 0) + (rumors.count ?? 0))
      } catch {
        // keep null → placeholder
      }
    }
    loadCounts()

    return () => clearInterval(id)
  }, [])

  return (
    <section style={{
      width: '100%',
      backgroundColor: '#ffffff',
      padding: '80px 32px 64px 32px',
      display: 'flex',
      justifyContent: 'center',
      borderBottom: '1px solid #f3f4f6'
    }}>
      <div className="hero-container" style={{
        maxWidth: '1200px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
      }}>
        
        {/* LEFT SIDE (60%) */}
        <div className="hero-left" style={{ flex: '0 0 60%' }}>
          {/* Pill label */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: '#e8f5ee',
              color: '#1a6b3c',
              border: '1px solid #4caf7d',
              borderRadius: '999px',
              padding: '4px 14px',
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontWeight: 500,
              fontSize: '12px',
              marginBottom: '24px'
            }}
          >
            🔴 LIVE COVERAGE — DAY {dayCount}
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(40px, 5vw, 64px)',
              lineHeight: 1.1,
              color: '#111827',
              letterSpacing: '-1px',
              marginBottom: '24px'
            }}
          >
            Iran-Israel War<br />
            <span style={{ color: '#1a6b3c' }}>Intelligence Hub.</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '480px',
              lineHeight: 1.6,
              marginBottom: '40px'
            }}
          >
            Real-time conflict tracking, economic impact analysis, and AI-verified intelligence — all in one dashboard.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
            style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
          >
            <a href="/timeline" className="hero-btn-primary" style={{
              backgroundColor: '#1a6b3c',
              color: '#ffffff',
              borderRadius: '999px',
              padding: '12px 24px',
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              border: '1px solid rgba(0,0,0,0)'
            }}>
              View Live Timeline <ArrowRight size={16} />
            </a>
            <a href="/economics" className="hero-btn-secondary" style={{
              backgroundColor: 'rgba(0,0,0,0)',
              border: '1.5px solid #e5e7eb',
              color: '#374151',
              borderRadius: '999px',
              padding: '12px 24px',
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}>
              Economic Dashboard
            </a>
          </motion.div>
        </div>

        {/* RIGHT SIDE (40%) */}
        <motion.div 
          className="hero-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: 'easeOut' }}
          style={{ flex: '0 0 40%' }}
        >
          <div className="hero-stats-card" style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            transition: 'all 0.3s ease',
            cursor: 'default'
          }}>
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#111827' }}>
                📡 Live Intelligence Feed
              </span>
              <span className="pulse-dot" />
            </div>

            <div style={{ height: '1px', background: '#f3f4f6', marginBottom: '20px' }} />

            {/* 4 stat rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              {[
                { label: 'Conflict Day', value: dayCount.toString() },
                { label: 'Events Logged', value: eventCount === null ? '—' : `${eventCount}+` },
                { label: 'Countries Watch', value: COUNTRIES_TRACKED.toString() },
                { label: 'Active Rumors', value: rumorCount === null ? '—' : rumorCount.toString() },
              ].map(stat => (
                <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontWeight: 500, fontSize: '13px', color: '#6b7280' }}>
                    {stat.label}
                  </span>
                  <span style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontWeight: 700, fontSize: '15px', color: '#111827' }}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ height: '1px', background: '#f3f4f6', marginBottom: '20px' }} />

            {/* Last updated */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <span style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '11px', color: '#9ca3af' }}>
                Updated: {mounted ? (time || '--:--:--') : '--:--:--'} IST
              </span>
            </div>
          </div>
        </motion.div>

      </div>

    </section>
  )
}
