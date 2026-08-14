'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

export function ChangeIndicator({ value, pct = false, size = 'sm' }) {
  const n = parseFloat(value)
  if (isNaN(n)) return null
  const isUp = n >= 0
  const fs = size === 'lg' ? '15px' : '12px'
  return (
    <span style={{
      fontFamily: 'var(--font-space-mono), Space Mono, monospace',
      fontVariantNumeric: 'tabular-nums',
      fontSize: fs,
      fontWeight: 600,
      color: isUp ? '#2d9e5f' : '#c96a6a',
    }}>
      {isUp ? '▲' : '▼'} {Math.abs(n).toFixed(2)}{pct ? '%' : ''}
    </span>
  )
}

export function Sparkline({ series, color, width = 90, height = 34 }) {
  if (!Array.isArray(series) || series.length < 2) return null
  const up = series[series.length - 1] >= series[0]
  const lineColor = up ? '#2d9e5f' : '#c96a6a'
  return (
    <div style={{ width, height, flexShrink: 0 }}>
      <Line
        data={{
          labels: series.map((_, i) => i),
          datasets: [{
            data: series,
            borderColor: lineColor,
            backgroundColor: 'rgba(45, 158, 95, 0.08)',
            pointRadius: 0,
            borderWidth: 1.5,
            tension: 0.35,
            fill: false,
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: { x: { display: false }, y: { display: false } },
        }}
      />
    </div>
  )
}

// Full history chart shown when a row/card is clicked
export function HistoryChart({ data, label, unit = '', height = 160 }) {
  if (!Array.isArray(data) || data.length < 2) {
    return (
      <div style={{
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        fontSize: '12px',
        color: '#9CA3AF',
        padding: '12px 0',
        textAlign: 'center',
        fontStyle: 'italic',
      }}>
        History accumulates over time — refresh again in ~30 min for a trend.
      </div>
    )
  }
  const values = data.map((p) => p.value)
  const up = values[values.length - 1] >= values[0]
  const lineColor = up ? '#2d9e5f' : '#c96a6a'
  const labels = data.map((p) => p.ts)
  return (
    <div style={{ width: '100%', height, marginTop: '10px' }}>
      <Line
        data={{
          labels,
          datasets: [{
            label,
            data: values,
            borderColor: lineColor,
            backgroundColor: lineColor + '14',
            pointRadius: 0,
            borderWidth: 2,
            tension: 0.3,
            fill: true,
          }],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#111827',
              titleFont: { family: 'var(--font-inter), Inter, sans-serif', size: 11 },
              bodyFont: { family: 'var(--font-space-mono), Space Mono, monospace', size: 11 },
              displayColors: false,
              callbacks: {
                label: (ctx) => `${ctx.parsed.y.toLocaleString('en-US', { minimumFractionDigits: 2 })}${unit}`,
                title: (items) => {
                  const t = items?.[0]?.label
                  return t ? t.slice(0, 16) : ''
                },
              },
            },
          },
          scales: {
            x: { display: true, grid: { display: false }, ticks: { color: '#9CA3AF', font: { family: 'var(--font-inter), Inter, sans-serif', size: 10 }, maxTicksLimit: 6 } },
            y: { display: true, position: 'right', grid: { color: '#F3F4F6' }, ticks: { color: '#9CA3AF', font: { family: 'var(--font-space-mono), Space Mono, monospace', size: 10 }, maxTicksLimit: 4 } },
          },
        }}
      />
    </div>
  )
}

export function extractSeries(history, key) {
  if (!Array.isArray(history)) return []
  return history
    .filter((h) => h[key] != null)
    .map((h) => ({ ts: h.ts, value: h[key] }))
}