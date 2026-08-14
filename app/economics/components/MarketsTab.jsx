'use client'

import { useState } from 'react'
import { Globe, Globe2, Earth } from 'lucide-react'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { Sparkline, HistoryChart, extractSeries } from '@/app/economics/components/HistoryChart'
import { MARKET_SYMBOLS, MARKET_REGIONS } from '@/app/economics/components/market-data'

export default function MarketsTab({ marketData, loading }) {
  const markets = Array.isArray(marketData?.markets) ? marketData.markets : []
  const history = marketData?.history || []
  const [openSymbol, setOpenSymbol] = useState(null)

  const getMarket = (symbol) => markets.find((m) => m.symbol === symbol)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {loading
        ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
        : MARKET_REGIONS.map((region) => {
            const regionSymbols = Object.entries(MARKET_SYMBOLS).filter(
              ([, v]) => v.region === region
            )
            return (
              <div key={region}>
                <div style={{
                  fontFamily: 'var(--font-inter), Inter, sans-serif',
                  fontWeight: 800,
                  fontSize: '13px',
                  color: '#374151',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                  paddingBottom: '6px',
                  borderBottom: '2px solid #F3F4F6',
                }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    {region === 'Asia-Pacific' ? <Globe2 size={14} /> : region === 'Europe' ? <Globe size={14} /> : <Earth size={14} />} {region}
                  </span>
                </div>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  {regionSymbols.map(([symbol, meta], idx) => {
                    const row = getMarket(symbol)
                    const pct = row?.change_pct != null
                      ? parseFloat(row.change_pct).toFixed(2)
                      : row
                        ? (((row.close - row.open) / row.open) * 100).toFixed(2)
                        : null
                    const isUp = pct !== null ? parseFloat(pct) >= 0 : null
                    return (
                      <div key={symbol}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '14px 20px',
                            borderBottom: idx < regionSymbols.length - 1 ? '1px solid #F3F4F6' : 'none',
                            background: idx % 2 === 0 ? '#FAFAFA' : '#FFFFFF',
                            transition: 'background 0.15s',
                            cursor: 'pointer',
                          }}
                          onClick={() => setOpenSymbol(openSymbol === symbol ? null : symbol)}
                          onMouseEnter={e => e.currentTarget.style.background = '#F0FDF4'}
                          onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#FAFAFA' : '#FFFFFF'}
                        >
                          <span style={{ fontSize: '22px', marginRight: '10px' }}>{meta.flag}</span>
                          <span style={{
                            fontFamily: 'var(--font-inter), Inter, sans-serif',
                            fontWeight: 600,
                            fontSize: '14px',
                            color: '#111827',
                            flex: 1,
                          }}>{meta.name}</span>
                          {row?.series && <Sparkline series={row.series.map((p) => p.value)} />}
                          {row ? (
                            <div style={{ textAlign: 'right', marginLeft: '12px' }}>
                              <div style={{
                                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                                fontSize: '15px',
                                fontWeight: 700,
                                color: '#111827',
                              }}>
                                {parseFloat(row.close).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                              </div>
                              <div style={{
                                fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: isUp ? '#2d9e5f' : '#c96a6a',
                              }}>
                                {isUp ? '▲' : '▼'} {Math.abs(parseFloat(pct))}%
                              </div>
                            </div>
                          ) : (
                            <span style={{
                              fontFamily: 'var(--font-inter), Inter, sans-serif',
                              fontSize: '12px',
                              color: '#9CA3AF',
                              fontStyle: 'italic',
                              marginLeft: '12px',
                            }}>Market closed</span>
                          )}
                        </div>
                        {openSymbol === symbol && (
                          <div style={{ padding: '0 20px 14px', background: idx % 2 === 0 ? '#FAFAFA' : '#FFFFFF' }}>
                            <HistoryChart data={extractSeries(history, symbol)} label={meta.name} height={140} />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
    </div>
  )
}