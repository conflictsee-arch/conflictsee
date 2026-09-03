'use client'

import { useState, useEffect, useCallback } from 'react'
import { Droplet, TrendingUp, Coins, Newspaper, Loader2, RefreshCw, Swords } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import EnergyTab from '@/app/economics/components/EnergyTab'
import MarketsTab from '@/app/economics/components/MarketsTab'
import CurrenciesTab from '@/app/economics/components/CurrenciesTab'
import NewsTab from '@/app/economics/components/NewsTab'
import { getWarDay } from '@/lib/constants'

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'energy',     label: 'Energy',     icon: <Droplet size={15} /> },
  { id: 'markets',    label: 'Markets',    icon: <TrendingUp size={15} /> },
  { id: 'currencies', label: 'Currencies', icon: <Coins size={15} /> },
  { id: 'news',       label: 'News',       icon: <Newspaper size={15} /> },
]

export default function EconomicsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('energy')
  const [marketData, setMarketData] = useState(null)
  const [loadingMarkets, setLoadingMarkets] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [warDay, setWarDay] = useState(28)

  // Mounted guard — never SSR dynamic values
  useEffect(() => {
    setMounted(true)
    setWarDay(getWarDay())
  }, [])

  const loadMarkets = useCallback(async (force = false) => {
    const url = force ? '/api/live-markets?force=true' : '/api/live-markets'
    if (force) setRefreshing(true)
    else setLoadingMarkets(true)
    try {
      const res = await fetch(url)
      const data = await res.json()
      setMarketData(data)
    } catch {
      setMarketData(null)
    }
    setLoadingMarkets(false)
    setRefreshing(false)
  }, [])

  useEffect(() => {
    loadMarkets()
    const iv = setInterval(() => loadMarkets(), 300_000)
    return () => clearInterval(iv)
  }, [loadMarkets])

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--bg-page)', fontFamily: 'var(--font-inter), Inter, sans-serif' }}>

        {/* ── PAGE TITLE SECTION ─────────────────────────────────────────────── */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                fontWeight: 800,
                fontSize: '28px',
                color: '#111827',
                margin: '0 0 6px',
              }}>Economic Dashboard</h1>
              <p style={{
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                fontSize: '14px',
                color: '#6B7280',
                margin: 0,
              }}>
                War impact on global markets · Feb 28, 2026 – Present
                {mounted && (
                  <span style={{
                    marginLeft: '10px',
                    background: '#FEF2F2',
                    color: '#DC2626',
                    borderRadius: '9999px',
                    padding: '1px 10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}><Swords size={12} /> Day {warDay}</span>
                )}
              </p>
            </div>
            <button
              onClick={() => loadMarkets(true)}
              disabled={refreshing}
              style={{
                borderRadius: '999px',
                border: '1.5px solid #4caf7d',
                background: '#E8F5EE',
                color: '#1a6b3c',
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 700,
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                cursor: refreshing ? 'not-allowed' : 'pointer',
                opacity: refreshing ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {refreshing ? <><Loader2 size={14} className="spin" /> Refreshing…</> : <><RefreshCw size={14} /> Refresh Markets</>}
            </button>
          </div>

          {/* ── TABS ─────────────────────────────────────────────────────────── */}
          <div style={{
            display: 'flex',
            gap: '0',
            borderBottom: '2px solid #F3F4F6',
            marginBottom: '28px',
            overflowX: 'auto',
          }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #1a6b3c' : '2px solid transparent',
                  marginBottom: '-2px',
                  color: activeTab === tab.id ? '#1a6b3c' : '#6B7280',
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              ><span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>{tab.icon}{tab.label}</span></button>
            ))}
          </div>

          {/* ── TAB CONTENT ──────────────────────────────────────────────────── */}
          <div style={{ paddingBottom: '60px' }}>
            {activeTab === 'energy' && (
              <EnergyTab
                marketData={marketData}
                loading={loadingMarkets}
                onForceRefresh={() => loadMarkets(true)}
                refreshing={refreshing}
              />
            )}
            {activeTab === 'markets' && (
              <MarketsTab marketData={marketData} loading={loadingMarkets} />
            )}
            {activeTab === 'currencies' && (
              <CurrenciesTab marketData={marketData} loading={loadingMarkets} />
            )}
            {activeTab === 'news' && <NewsTab />}
          </div>
        </div>

      </div>

      <Footer />
    </>
  )
}