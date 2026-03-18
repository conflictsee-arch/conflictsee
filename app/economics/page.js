import Navbar from '@/components/Navbar'
import EconomicsSection from '@/components/EconomicsSection'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Economics | ConflictSee',
  description: 'War-impacted asset prices, oil, gold and currency data.',
}

export default function EconomicsPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-8 py-16" style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 32px' }}>
        <EconomicsSection />
      </main>
      <Footer />
    </>
  )
}
