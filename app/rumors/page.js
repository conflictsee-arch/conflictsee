import Navbar from '@/components/Navbar'
import RumorsSection from '@/components/RumorsSection'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Rumors & Intel | ConflictSee',
  description: 'AI fact-checked rumors and unverified intelligence reports.',
}

export default function RumorsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-8 py-16" style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 32px' }}>
        <RumorsSection />
      </main>
      <Footer />
    </>
  )
}
