'use client'

import { useState } from 'react'
import { Clock, Loader2, RefreshCw, TrendingUp } from 'lucide-react'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { ChangeIndicator, HistoryChart, extractSeries } from '@/app/economics/components/HistoryChart'
import { COMMODITY_ITEMS } from '@/app/economics/components/market-data'

export default function EnergyTab({ marketData, loading, onForceRefresh, refreshing }) {
  const lastUpdated = marketData?.last_updated
  const cacheAge = marketData?.cache_age_minutes
  const fromCache = marketData?.from_cache
  const [openHistory, setOpenHistory] = useState(null)
  const history = marketData?.history || []

  return (
    <div>
      {/* Cache Info Bar */}
      {!loading && lastUpdated && (
        <div style={{
          background: fromCache ? '#FFFBEB' : '#F0FDF4',
          border: `1px solid ${fromCache ? '#FDE68A' : '#BBF7D0'}`,
          borderRadius: '10px',
          padding: '10px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', color: fromCache ? '#B45309' : '#1a6b3c' }}><Clock size={15} /></span>
            <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: '13px', color: fromCache ? '#92400E' : '#065F46' }}>
              {fromCache
                ? `Cached data — refreshed ${cacheAge} min ago. Next auto-refresh in ~${30 - cacheAge} min.`
                : `Live data fetched just now. Cached for 30 minutes.`}
            </span>
          </div>
          <button
            onClick={onForceRefresh}
            disabled={refreshing}
            style={{
              background: 'none',
              border: `1px solid ${fromCache ? '#D97706' : '#059669'}`,
              borderRadius: '999px',
              padding: '4px 14px',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              color: fromCache ? '#D97706' : '#059669',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              opacity: refreshing ? 0.6 : 1,
              whiteSpace: 'nowrap',
            }}
          >
            {refreshing ? <><Loader2 size={14} className="spin" /> Fetching…</> : <><RefreshCw size={14} /> Force Refresh Now</>}
          </button>
        </div>
      )}

      {/* Commodity Grid */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
        className="commodity-grid"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : COMMODITY_ITEMS.map((item) => {
              const d = item.src === 'oil'
                ? marketData?.oil?.[item.subKey]
                : marketData?.commodities?.[item.subKey]
              const hasData = d && d.price

              return (
                <div
                  key={item.key}
                  className="card"
                  style={{
                    padding: '20px',
                    transition: 'box-shadow 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.10)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <span style={{ fontSize: '20px' }}>{item.icon}</span>
                    <span style={{
                      fontFamily: 'var(--font-inter), Inter, sans-serif',
                      fontWeight: 700,
                      fontSize: '14px',
                      color: '#111827',
                    }}>{item.label}</span>
                  </div>

                  {hasData ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                        <span style={{
                          fontFamily: 'var(--font-inter), Inter, sans-serif',
                          fontSize: '15px',
                          fontWeight: 600,
                          color: '#6B7280',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}>{item.icon}</span>
                        <span style={{
                          fontFamily: 'var(--font-space-mono), Space Mono, monospace',
                          fontVariantNumeric: 'tabular-nums',
                          fontSize: '26px',
                          fontWeight: 700,
                          color: '#111827',
                          letterSpacing: '-0.5px',
                        }}>
                          ${parseFloat(d.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-inter), Inter, sans-serif',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#9CA3AF',
                        }}>{item.unit}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <ChangeIndicator value={d.change} />
                        <ChangeIndicator value={d.change_pct} pct />
                        <span style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: '11px', color: '#9CA3AF' }}>today</span>
                      </div>
                    </>
                  ) : (
                    <div style={{
                      fontFamily: 'var(--font-inter), Inter, sans-serif',
                      fontSize: '14px',
                      color: '#9CA3AF',
                      marginBottom: '14px',
                      fontStyle: 'italic',
                    }}>
                      Data loading…
                    </div>
                  )}

                  <div style={{
                    fontFamily: 'var(--font-inter), Inter, sans-serif',
                    fontSize: '11px',
                    color: '#6B7280',
                    lineHeight: 1.5,
                    borderTop: '1px solid #F3F4F6',
                    paddingTop: '10px',
                  }}>{item.note}</div>

                  {openHistory === item.key ? (
                    <div style={{ borderTop: '1px solid #F3F4F6', marginTop: '12px', paddingTop: '4px' }}>
                      <HistoryChart data={extractSeries(history, item.key)} label={item.label} unit={item.unit} height={150} />
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenHistory(item.key) }}
                      style={{
                        marginTop: '12px',
                        width: '100%',
                        background: '#F0FDF4',
                        border: '1px solid #D1FAE5',
                        borderRadius: '999px',
                        padding: '5px 0',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#1a6b3c',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-inter), Inter, sans-serif',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><TrendingUp size={14} /> View Price History</span>
                    </button>
                  )}
                </div>
              )
            })}
      </div>
    </div>
  )
}