'use client'

import { useState, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

const STATS = [
  {
    featured: true,
    label: 'TOTAL EVENTS',
    number: 247,
    sub: '↑ Since Feb 28',
  },
  {
    featured: false,
    label: 'COUNTRIES AFFECTED',
    number: 43,
    sub: 'Across 6 regions',
  },
  {
    featured: false,
    label: 'MARKETS IMPACTED',
    number: 15,
    sub: 'Live prices tracked',
  },
  {
    featured: false,
    label: 'ACTIVE RUMORS',
    number: 12,
    sub: 'Under monitoring',
  },
]

function AnimatedCounter({ to }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime
    const duration = 1500 // 1.5s
    
    // easeOut cubic
    const easeOut = (t) => 1 - Math.pow(1 - t, 3)

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      
      if (progress < duration) {
        const percentage = progress / duration
        const currentCount = Math.floor(to * easeOut(percentage))
        setCount(currentCount)
        requestAnimationFrame(animate)
      } else {
        setCount(to)
      }
    }
    
    requestAnimationFrame(animate)
  }, [to])

  return <>{count}</>
}

export default function StatsBar() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      margin: '24px 32px',
    }}>
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 + (i * 0.1), ease: "easeOut" }}
          whileHover={{
            y: -4,
            boxShadow: stat.featured ? '0 12px 32px rgba(26,107,60,0.3)' : '0 8px 24px rgba(0,0,0,0.10)',
            borderColor: stat.featured ? 'rgba(0,0,0,0)' : '#4caf7d',
            transition: { duration: 0.25, ease: "easeOut" }
          }}
          style={{
            background: stat.featured ? '#1a6b3c' : '#ffffff',
            borderRadius: '16px',
            border: stat.featured ? '1px solid rgba(0,0,0,0)' : '1px solid #e5e7eb',
            padding: '20px',
            boxShadow: stat.featured
              ? '0 4px 16px rgba(26,107,60,0.25)'
              : '0 1px 3px rgba(0,0,0,0.06)',
            position: 'relative',
            cursor: 'default'
          }}
        >
          {/* Arrow top-right */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            color: stat.featured ? 'rgba(255,255,255,0.7)' : '#9ca3af',
          }}>
            <ArrowUpRight size={16} />
          </div>

          {/* Label */}
          <p style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 500,
            fontSize: '11px',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            color: stat.featured ? 'rgba(255,255,255,0.85)' : '#9ca3af',
            marginBottom: '10px',
          }}>
            {stat.label}
          </p>

          {/* Number — Space Mono */}
          <p style={{
            fontFamily: 'var(--font-space-mono), Space Mono, monospace',
            fontWeight: 700,
            fontSize: '36px',
            lineHeight: 1,
            color: stat.featured ? '#ffffff' : '#111827',
            marginBottom: '8px',
          }}>
            <AnimatedCounter to={stat.number} />
          </p>

          {/* Sub text */}
          <p style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 400,
            fontSize: '12px',
            color: stat.featured ? 'rgba(255,255,255,0.65)' : '#9ca3af',
          }}>
            {stat.sub}
          </p>
        </motion.div>
      ))}

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 900px) {
          div[style*="repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 520px) {
          div[style*="repeat(4"] {
            grid-template-columns: 1fr !important;
            margin: 16px 16px !important;
          }
        }
      `}</style>
    </div>
  )
}
