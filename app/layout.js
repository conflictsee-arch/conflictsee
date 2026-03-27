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
  title: 'ConflictSee',
  description: 'Real-time Iran-Israel war intelligence dashboard',
  metadataBase: new URL('https://conflictsee.vercel.app'),
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'ConflictSee',
    description: 'Real-time Iran-Israel war intelligence dashboard',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }} suppressHydrationWarning>
        <main style={{ minHeight: '100vh', background: '#ffffff' }}>
          {children}
        </main>
      </body>
    </html>
  )
}
