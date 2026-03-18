import Navbar from '@/components/Navbar'
import TimelineSection from '@/components/TimelineSection'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Timeline | ConflictSee',
  description: 'Chronological log of all verified and unconfirmed events.',
}

export default function TimelinePage() {
  return (
    <>
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-8 py-16" style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 32px' }}>
        <TimelineSection />
      </main>
      <Footer />
    </>
  )
}
