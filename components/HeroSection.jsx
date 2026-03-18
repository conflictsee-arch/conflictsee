'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  const [time, setTime] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const update = () => {
      const now = new Date()
      const ist = new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZone: 'Asia/Kolkata',
      }).format(now)
      setTime(ist)
    }
    update()
    const id = setInterval(update, 1000)
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
            🔴 LIVE COVERAGE — DAY 18
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
            <a href="#timeline" className="hero-btn-primary" style={{
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
                { label: 'Conflict Day', value: '18' },
                { label: 'Events Logged', value: '247+' },
                { label: 'Countries Watch', value: '43' },
                { label: 'Active Rumors', value: '12' },
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

      <style>{`
        .hero-btn-primary:hover {
          background-color: #2d9e5f !important;
          transform: scale(1.02);
        }
        .hero-btn-secondary:hover {
          border-color: #1a6b3c !important;
          color: #1a6b3c !important;
        }
        .hero-stats-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.12) !important;
          transform: translateY(-4px);
        }

        /* 60/40 gap desktop, stack mobile */
        .hero-container {
          gap: 64px;
        }
        @media (max-width: 968px) {
          .hero-container {
            flex-direction: column;
            gap: 40px;
          }
          .hero-left, .hero-right {
            flex: 1 1 100% !important;
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
