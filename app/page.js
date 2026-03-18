import Link from 'next/link'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import StatsBar from '@/components/StatsBar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'ConflictSee | Real-time Intelligence',
  description: 'Live Iran-Israel war intelligence and tracking dashboard.',
}

export default function Home() {
  const cards = [
    {
      id: 'timeline',
      title: '⏱️ Conflict Timeline',
      desc: 'Chronological log of all verified and unconfirmed events',
      link: '/timeline'
    },
    {
      id: 'economics',
      title: '📊 Economic Dashboard',
      desc: 'War-impacted asset prices, oil, gold and currency data',
      link: '/economics'
    },
    {
      id: 'world-affairs',
      title: '🌍 World Affairs',
      desc: 'Country positions, UN votes and geopolitical impact scores',
      link: '/world-affairs'
    },
    {
      id: 'rumors',
      title: '🔮 Rumors & Intel',
      desc: 'AI fact-checked rumors and unverified intelligence reports',
      link: '/rumors'
    }
  ]

  return (
    <>
      <Navbar />
      <HeroSection />
      <StatsBar />

      <main 
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
          
          <div className="overview-grid" style={{ display: 'grid', gap: '24px' }}>
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
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontWeight: 600,
                    fontSize: '18px',
                    color: '#111827',
                    margin: '0 0 12px 0'
                  }}>
                    {c.title}
                  </h3>
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
      </main>

      <style>{`
        .overview-grid {
          grid-template-columns: repeat(4, 1fr);
        }
        .overview-card > div:hover {
          transform: translateY(-4px);
          border-color: #4caf7d !important;
          box-shadow: 0 12px 24px rgba(0,0,0,0.06);
        }
        @media (max-width: 968px) {
          .overview-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .overview-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <Footer />
    </>
  )
}
