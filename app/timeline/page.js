import Navbar from '@/components/layout/Navbar'
import TimelineSection from '@/components/timeline/TimelineSection'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Timeline | ConflictSee',
  description: 'Chronological log of all verified and unconfirmed events.',
}

export default function TimelinePage() {
  return (
    <>
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-8 py-16" style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 32px' }}>
        <TimelineSection />
      </div>
      <Footer />
    </>
  )
}
