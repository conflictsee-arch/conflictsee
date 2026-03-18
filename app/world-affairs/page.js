import Navbar from '@/components/Navbar'
import WorldAffairsSection from '@/components/WorldAffairsSection'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'World Affairs | ConflictSee',
  description: 'Country positions, UN votes and geopolitical impact scores.',
}

export default function WorldAffairsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-8 py-16" style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 32px' }}>
        <WorldAffairsSection />
      </main>
      <Footer />
    </>
  )
}
