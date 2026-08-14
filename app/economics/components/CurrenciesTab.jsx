'use client'

import { useState } from 'react'
import { Shield, Landmark, Globe, Globe2, TrendingDown, Flame } from 'lucide-react'
import { HistoryChart, extractSeries } from '@/app/economics/components/HistoryChart'
import {
  ALL_CURRENCY_ITEMS,
  PRESSURE_CURRENCIES,
  SAFEHAVEN_CURRENCIES,
  GLOBAL_MAJOR_CURRENCIES,
  GULF_REGION_CURRENCIES,
  FRONTIER_CURRENCIES,
} from '@/app/economics/components/market-data'

const CURRENCY_GROUPS = [
  { title: 'Under War Pressure', color: '#DC2626', bg: '#FFF5F5', icon: <Shield size={14} style={{ color: '#DC2626' }} />, items: PRESSURE_CURRENCIES },
  { title: 'War Safe Havens', color: '#15803D', bg: '#F0FDF4', icon: <Landmark size={14} style={{ color: '#15803D' }} />, items: SAFEHAVEN_CURRENCIES },
  { title: 'Global Majors', color: '#1D4ED8', bg: '#F8FAFC', icon: <Globe size={14} style={{ color: '#1D4ED8' }} />, items: GLOBAL_MAJOR_CURRENCIES },
  { title: 'Gulf & Asia Region', color: '#B45309', bg: '#FFFBEB', icon: <Globe2 size={14} style={{ color: '#B45309' }} />, items: GULF_REGION_CURRENCIES },
  { title: 'Frontier & EM', color: '#7C3AED', bg: '#F5F3FF', icon: <TrendingDown size={14} style={{ color: '#7C3AED' }} />, items: FRONTIER_CURRENCIES },
]

function heatColor(changePct) {
  if (changePct == null || isNaN(parseFloat(changePct))) return null
  const v = parseFloat(changePct)
  const t = Math.min(Math.abs(v), 1) / 1 // 0..1
  const alpha = 0.15 + t * 0.6
  if (v >= 0) return `rgba(45, 158, 95, ${alpha})` // site green
  return `rgba(201, 106, 106, ${alpha})` // muted red
}

function CurrencyHeatmap({ forex }) {
  return (
    <div className="card" style={{ padding: '18px', marginBottom: '20px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '12px', flexWrap: 'wrap', gap: '8px',
      }}>
        <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontWeight: 800, fontSize: '15px', color: '#111827', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Flame size={15} style={{ color: '#DC2626' }} /> Currency Heatmap
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '11px', fontFamily: 'var(--font-inter), Inter, sans-serif', color: '#6B7280' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(45,158,95,0.5)', display: 'inline-block' }} /> strengthening vs USD
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(201,106,106,0.5)', display: 'inline-block' }} /> weakening vs USD
          </span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }} className="heatmap-grid">
        {ALL_CURRENCY_ITEMS.map((c) => {
          const d = forex[c.pair]
          const change = d?.change_pct
          const bg = heatColor(change)
          return (
            <div key={c.pair} style={{
              background: bg || '#F8FAFC',
              border: '1px solid #E5E7EB',
              borderRadius: '10px',
              padding: '10px 12px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '18px' }}>{c.flag}</div>
              <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontWeight: 700, fontSize: '11px', color: '#111827', marginTop: '2px' }}>{c.pair}</div>
              <div style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '12px', fontWeight: 700, color: '#111827' }}>
                {d?.rate != null ? parseFloat(d.rate).toFixed(2) : '—'}
              </div>
              <div style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '10px', fontWeight: 700, color: change != null && parseFloat(change) >= 0 ? '#2d9e5f' : '#c96a6a' }}>
                {change != null && !isNaN(parseFloat(change))
                  ? `${parseFloat(change) >= 0 ? '▲' : '▼'} ${Math.abs(parseFloat(change)).toFixed(2)}%`
                  : 'needs refresh'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CurrenciesTab({ marketData, loading }) {
  const forex = marketData?.forex || {}
  const history = marketData?.history || []
  const [openPair, setOpenPair] = useState(null)

  function CurrencyRow({ pair, flag, symbol, note, isLast }) {
    const d = forex[pair]
    const rate = d?.rate
    const change = d?.change_pct
    const hasChange = change != null && !isNaN(parseFloat(change))
    const isUp = hasChange && parseFloat(change) >= 0
    const cols = hasChange && rate != null ? '1fr auto auto' : '1fr auto'

    return (
      <div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: cols,
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
          gap: '10px',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
          onClick={() => setOpenPair(openPair === pair ? null : pair)}
          onMouseEnter={e => e.currentTarget.style.background = '#F0FDF4'}
          onMouseLeave={e => e.currentTarget.style.background = ''}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>{flag}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                fontWeight: 700,
                fontSize: '13px',
                color: '#111827',
              }}>{pair}</div>
              <div style={{
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                fontSize: '11px',
                color: '#6B7280',
                lineHeight: 1.4,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>{note}</div>
            </div>
          </div>
          {hasChange && (
            <span style={{
              fontFamily: 'var(--font-space-mono), Space Mono, monospace',
              fontSize: '11px',
              fontWeight: 700,
              color: isUp ? '#2d9e5f' : '#c96a6a',
              whiteSpace: 'nowrap',
            }}>
              {isUp ? '▲' : '▼'} {Math.abs(parseFloat(change)).toFixed(2)}%
            </span>
          )}
          <div style={{
            fontFamily: 'var(--font-space-mono), Space Mono, monospace',
            fontWeight: 700,
            fontSize: '15px',
            color: '#111827',
            textAlign: 'right',
            whiteSpace: 'nowrap',
          }}>
            {rate
              ? `${symbol}${parseFloat(rate).toFixed(2)}`
              : <span style={{ color: '#9CA3AF', fontSize: '13px', fontStyle: 'italic' }}>Loading…</span>}
          </div>
        </div>
        {openPair === pair && (
          <div style={{ padding: '0 16px 12px' }}>
            <HistoryChart data={extractSeries(history, pair)} label={pair} height={130} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <CurrencyHeatmap forex={forex} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="currency-grid">
        {CURRENCY_GROUPS.map((g) => (
          <div key={g.title}>
            <div style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontWeight: 800, fontSize: '13px',
              color: g.color,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '10px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              {g.icon}{g.title}
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden', background: g.bg }}>
              {g.items.map((c, i) => (
                <CurrencyRow key={c.pair} {...c} isLast={i === g.items.length - 1} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}