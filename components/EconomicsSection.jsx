'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function EconomicsSection() {
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState('')

  useEffect(() => {
    async function fetchPrices() {
      setLoading(true)
      const { data, error } = await supabase
        .from('prices')
        .select('*')
        .order('updated_at', { ascending: false })
      
      if (!error && data) {
        setPrices(data)
        const now = new Date()
        const ist = new Intl.DateTimeFormat('en-IN', {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata',
        }).format(now)
        setLastUpdated(ist)
      }
      setLoading(false)
    }
    
    fetchPrices()
    const id = setInterval(fetchPrices, 60000)
    return () => clearInterval(id)
  }, [])

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
            02
          </span>
          <h2 style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 700,
            fontSize: '28px',
            color: '#111827',
            margin: 0,
            lineHeight: 1.2
          }}>
            Economic Dashboard
          </h2>
          <p style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            color: '#9ca3af',
            margin: '4px 0 0 0'
          }}>
            War-impacted assets — live prices
          </p>
        </div>

        <div className="mono" style={{ fontSize: '12px', color: '#9ca3af' }}>
          Updated {lastUpdated || '--:--:--'}
        </div>
      </div>

      {/* CONTENT LOGIC */}
      {loading ? (
        <div className="eco-grid">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="skeleton" style={{ height: '150px', borderRadius: '20px' }} />
          ))}
        </div>
      ) : prices.length === 0 ? (
        <div style={{ padding: '64px', textAlign: 'center', color: '#9ca3af', fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
          No economic data logged yet
        </div>
      ) : (
        <div className="eco-grid">
          {prices.map((asset, index) => {
            const isUp = asset.change_pct > 0
            const isNeutral = asset.change_pct === 0 || !asset.change_pct
            
            return (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", borderColor: "#4caf7d" }}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e5e7eb',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* ROW 1: Name and Currency */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontWeight: 600, fontSize: '14px', color: '#111827' }}>
                    {asset.asset_name}
                  </span>
                  <span style={{
                    background: '#f3f4f6',
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '11px',
                    borderRadius: '999px',
                    padding: '2px 8px',
                    color: '#6b7280'
                  }}>
                    {asset.currency}
                  </span>
                </div>

                {/* ROW 2: Price */}
                <div className="mono" style={{ 
                  fontSize: '32px', 
                  fontWeight: 700, 
                  color: '#111827',
                  margin: '12px 0 4px 0',
                  lineHeight: 1
                }}>
                  {asset.price}
                </div>

                {/* ROW 3: Change Badge */}
                <div style={{ display: 'flex' }}>
                  <span style={{
                    background: isUp ? '#f0fdf4' : isNeutral ? '#f3f4f6' : '#fef2f2',
                    color: isUp ? '#15803d' : isNeutral ? '#6b7280' : '#e53935',
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '12px'
                  }}>
                    {isUp ? '↑ +' : isNeutral ? '' : '↓ '}{asset.change_pct}%
                  </span>
                </div>

                {/* ROW 4: Why it matters */}
                {asset.why_it_matters && (
                  <p style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '12px',
                    color: '#9ca3af',
                    marginTop: '12px',
                    marginBottom: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.4
                  }}>
                    {asset.why_it_matters}
                  </p>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      <style>{`
        .eco-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .eco-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .eco-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </motion.section>
  )
}
