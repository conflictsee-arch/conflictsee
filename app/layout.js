import { Inter, Space_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata = {
  title: 'ConflictSee — Real-Time Iran-Israel War Intelligence Dashboard',
  description:
    'ConflictSee is a real-time intelligence dashboard tracking the Iran-Israel conflict — timeline, economics, world affairs, and rumors.',
  keywords: 'Iran Israel war, conflict tracker, intelligence dashboard, real-time news',
  openGraph: {
    title: 'ConflictSee',
    description: 'Real-time Iran-Israel War Intelligence Dashboard',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
