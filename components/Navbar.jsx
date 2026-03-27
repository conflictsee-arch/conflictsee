'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Timeline',     href: '/timeline' },
  { label: 'Economics',    href: '/economics' },
  { label: 'World Affairs',href: '/world-affairs' },
  { label: 'Rumors',       href: '/rumors' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [time, setTime] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Dynamic war day count (Feb 28, 2026 = Day 1)
  const [dayCount, setDayCount] = useState(28) // Safe server default
  useEffect(() => {
    const warStart = new Date('2026-02-28T00:00:00Z')
    const now = new Date()
    const d = Math.floor((now - warStart) / (1000 * 60 * 60 * 24)) + 1
    const finalDay = d > 0 ? d : 1
    setDayCount(finalDay)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const ist = new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false, timeZone: 'Asia/Kolkata',
      }).format(now)
      setTime(ist)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* ── NAVBAR ─────────────────────────── */}
      <nav style={{
        background: scrolled ? 'rgba(255,255,255,0.85)' : '#ffffff',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '64px',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
      }}>

        {/* LEFT — Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: '#1a6b3c',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{
                color: '#ffffff',
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.5px',
              }}>CS</span>
            </div>
            <span style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontWeight: 700,
              fontSize: '18px',
              color: '#1a6b3c',
              letterSpacing: '-0.3px',
            }}>ConflictSee</span>
          </Link>
        </div>

        {/* CENTER — Nav links (desktop only) */}
        <div className="desktop-nav" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          {NAV_LINKS.map(link => {
            const isActive = mounted && pathname === link.href
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={{ whiteSpace: 'nowrap' }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* RIGHT — LIVE + DAY badge + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          {/* LIVE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulse-dot" />
            <span style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              color: '#e53935',
            }}>LIVE</span>
          </div>

          {/* DAY pill */}
          <span style={{
            background: '#e8f5ee',
            color: '#1a6b3c',
            borderRadius: '999px',
            padding: '4px 10px',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 600,
            fontSize: '12px',
            border: '1px solid #4caf7d',
          }}>DAY {dayCount}</span>

          {/* Hamburger — mobile only */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#374151',
              display: 'none',
            }}
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* ── CONFLICT BANNER ─────────────────── */}
      <div style={{
        width: '100%',
        height: '36px',
        background: '#e8f5ee',
        borderBottom: '1px solid #4caf7d',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '32px',
        gap: '8px',
      }}>
        <span style={{
          fontFamily: 'var(--font-inter), Inter, sans-serif',
          fontWeight: 500,
          fontSize: '12px',
          color: '#1a6b3c',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          ⚠️ CONFLICT ACTIVE — DAY {dayCount} &nbsp;|&nbsp; Iran-Israel War &nbsp;|&nbsp; ConflictSee &nbsp;|&nbsp;
          Last Updated: <span style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}>{mounted ? time : '--:--:--'}</span> IST &nbsp;|&nbsp; 🔄 Auto-refresh: ON
        </span>
      </div>

      {/* ── MOBILE OVERLAY ──────────────────── */}
      {mobileOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#ffffff',
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          {/* Close button */}
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#374151',
            }}
          >
            <X size={28} />
          </button>

          {/* Logo in overlay */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{
              width: '44px', height: '44px',
              background: '#1a6b3c',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '16px' }}>CS</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '22px', color: '#1a6b3c' }}>ConflictSee</span>
          </div>

          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href || (pathname === '/' && link.href === '/')
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontWeight: 600,
                  fontSize: '20px',
                  color: isActive ? '#1a6b3c' : '#374151',
                  textDecoration: 'none',
                  padding: '12px 40px',
                  borderRadius: '12px',
                  background: isActive ? '#e8f5ee' : 'rgba(0,0,0,0)',
                  width: '100%',
                  textAlign: 'center',
                  transition: 'all 0.15s',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      )}


    </>
  )
}
