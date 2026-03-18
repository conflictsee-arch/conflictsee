'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import StatsBar from '@/components/StatsBar'
import Footer from '@/components/Footer'

const SECTIONS = [
  { emoji: '⏱️', title: 'Conflict Timeline',   id: 'timeline',      number: '01', desc: 'Chronological log of all verified and unconfirmed conflict events.' },
  { emoji: '📊', title: 'Economic Dashboard',  id: 'economics',     number: '02', desc: 'Live oil, gold, currency and market data impacted by the conflict.' },
  { emoji: '🌍', title: 'World Affairs',       id: 'world-affairs', number: '03', desc: 'Country stances, UN votes, diplomatic shifts and geopolitical impacts.' },
  { emoji: '🔮', title: 'Rumors & Intel',      id: 'rumors',        number: '04', desc: 'Unverified reports monitored and fact-checked in real time.' },
]

function SectionDivider() {
  return (
    <div style={{
      height: '1px',
      background: 'linear-gradient(to right, transparent, #e5e7eb 20%, #e5e7eb 80%, transparent)',
      margin: '0 32px'
    }} />
  )
}

export default function HomePage() {
  return (
    <main style={{ background: 'var(--bg-page)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <HeroSection />
      
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        <StatsBar />

        <div style={{ padding: '24px 32px 48px', display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {SECTIONS.map((section, sectionIndex) => (
            <div key={section.id}>
              {sectionIndex > 0 && <div style={{ marginBottom: '48px' }}><SectionDivider /></div>}
              
              <motion.section
                id={section.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ once: true, margin: "-80px" }}
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  border: '1px solid #e5e7eb',
                  padding: '40px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* SECTION NUMBER ANIMATION */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                  style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontWeight: 800,
                    fontSize: '64px',
                    color: '#f3f4f6',
                    position: 'absolute',
                    top: '-12px',
                    left: '20px',
                    zIndex: 0,
                    lineHeight: 1,
                    userSelect: 'none'
                  }}
                >
                  {section.number}
                </motion.div>

                {/* Section header */}
                <div className="section-header" style={{ position: 'relative', zIndex: 1 }}>
                  <div>
                    <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '8px' }}>
                      {section.emoji} {section.title}
                    </h2>
                    <p className="section-subtitle" style={{ fontSize: '15px' }}>{section.desc}</p>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '11px',
                    letterSpacing: '0.8px',
                    color: '#1a6b3c',
                    background: '#e8f5ee',
                    border: '1px solid #4caf7d',
                    borderRadius: '999px',
                    padding: '6px 14px',
                  }}>
                    COMING SOON
                  </span>
                </div>

                {/* Skeleton placeholder rows */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px', position: 'relative', zIndex: 1 }}>
                  {[1, 2, 3].map((j, i) => (
                    <motion.div 
                      key={j} 
                      className="skeleton" 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        ease: "easeOut",
                        delay: i * 0.08
                      }}
                      viewport={{ once: true }}
                      whileHover={{ 
                        y: -4,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.10)"
                      }}
                      style={{ 
                        height: '140px', 
                        borderRadius: '16px',
                        background: '#f9fafb',
                        border: '1px solid #f3f4f6'
                      }} 
                    />
                  ))}
                </div>
              </motion.section>
            </div>
          ))}
        </div>
      </div>

      <Footer />

      {/* Responsive padding */}
      <style>{`
        @media (max-width: 768px) {
          main > div > div { padding: 16px 16px 32px !important; }
          section { padding: 24px !important; }
        }
      `}</style>
    </main>
  )
}
