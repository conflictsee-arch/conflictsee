'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Timeline',     href: '#timeline' },
  { label: 'Economics',    href: '#economics' },
  { label: 'World Affairs',href: '#world-affairs' },
  { label: 'Rumors',       href: '#rumors' },
  { label: 'Ask AI',       href: '#ask-ai' },
]

export default function Navbar() {
  const [active, setActive] = useState('Timeline')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [time, setTime] = useState('')
  const [scrolled, setScrolled] = useState(false)

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
        </div>

        {/* CENTER — Nav links (desktop only) */}
        <div className="desktop-nav" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className={`nav-link ${active === link.label ? 'active' : ''}`}
              onClick={() => setActive(link.label)}
              style={{
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                color: active === link.label ? '#1a6b3c' : '#6b7280',
                textDecoration: 'none',
                padding: '10px 0',
                transition: 'color 0.2s',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                position: 'relative',
              }}
            >
              {link.label}
            </a>
          ))}
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

          {/* DAY 18 pill */}
          <span style={{
            background: '#e8f5ee',
            color: '#1a6b3c',
            borderRadius: '999px',
            padding: '4px 10px',
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontWeight: 600,
            fontSize: '12px',
            border: '1px solid #4caf7d',
          }}>DAY 18</span>

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
          ⚠️ CONFLICT ACTIVE — DAY 18 &nbsp;|&nbsp; Iran-Israel War &nbsp;|&nbsp; ConflictSee &nbsp;|&nbsp;
          Last Updated: <span style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace' }}>{time}</span> IST &nbsp;|&nbsp; 🔄 Auto-refresh: ON
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

          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => { setActive(link.label); setMobileOpen(false) }}
              style={{
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                fontWeight: 600,
                fontSize: '20px',
                color: active === link.label ? '#1a6b3c' : '#374151',
                textDecoration: 'none',
                padding: '12px 40px',
                borderRadius: '12px',
                background: active === link.label ? '#e8f5ee' : 'transparent',
                width: '100%',
                textAlign: 'center',
                transition: 'all 0.15s',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* ── RESPONSIVE STYLES ────────────────── */}
      <style>{`
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #1a6b3c;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.2s ease;
        }
        .nav-link:hover {
          color: #1a6b3c !important;
        }
        .nav-link:hover::after {
          transform: scaleX(1);
        }
        .nav-link.active::after {
          transform: scaleX(1);
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
