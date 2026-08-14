import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/home/HeroSection'
import StatsBar from '@/components/home/StatsBar'
import Footer from '@/components/layout/Footer'
import { Clock, BarChart3, Globe, Radio } from 'lucide-react'

export const metadata = {
  title: 'ConflictSee | Real-time Intelligence',
  description: 'Live Iran-Israel war intelligence and tracking dashboard.',
}

export default function Home() {
  const cards = [
    {
      id: 'timeline',
      icon: <Clock size={20} strokeWidth={2} />,
      title: 'Conflict Timeline',
      desc: 'Chronological log of all verified and unconfirmed events',
      link: '/timeline'
    },
    {
      id: 'economics',
      icon: <BarChart3 size={20} strokeWidth={2} />,
      title: 'Economic Dashboard',
      desc: 'War-impacted asset prices, oil, gold and currency data',
      link: '/economics'
    },
    {
      id: 'world-affairs',
      icon: <Globe size={20} strokeWidth={2} />,
      title: 'World Affairs',
      desc: 'Country positions, UN votes and geopolitical impact scores',
      link: '/world-affairs'
    },
    {
      id: 'rumors',
      icon: <Radio size={20} strokeWidth={2} />,
      title: 'Rumors & Intel',
      desc: 'AI fact-checked rumors and unverified intelligence reports',
      link: '/rumors'
    }
  ]

  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsBar />

      <div 
        className="max-w-[1200px] mx-auto px-8"
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px'
        }}
      >
        <section style={{ margin: '64px 0' }}>
          <h2 style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 700, 
            fontSize: '28px', 
            color: '#111827',
            marginBottom: '32px'
          }}>
            Intelligence Sections
          </h2>
          
          <div className="overview-grid">
            {cards.map(c => (
              <Link href={c.link} key={c.id} style={{ textDecoration: 'none' }} className="overview-card">
                <div style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  border: '1px solid #e5e7eb',
                  padding: '28px',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                      width: '38px', height: '38px',
                      background: '#E8F5EE',
                      borderRadius: '10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#1a6b3c',
                      flexShrink: 0,
                    }}>
                      {c.icon}
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-inter), Inter, sans-serif',
                      fontWeight: 600,
                      fontSize: '18px',
                      color: '#111827',
                      margin: 0
                    }}>
                      {c.title}
                    </h3>
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '0 0 24px 0',
                    lineHeight: 1.5,
                    flexGrow: 1
                  }}>
                    {c.desc}
                  </p>
                  <div style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#1a6b3c'
                  }}>
                    View Section →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
