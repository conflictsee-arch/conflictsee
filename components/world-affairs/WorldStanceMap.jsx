'use client'

import { useState } from 'react'
import worldMap from '@svg-maps/world'
import { Globe } from 'lucide-react'
import { ALIGNMENT_META, INTENSITY_META } from '@/lib/countryStances'

// Map alignment → fill color (muted, on-theme tints from ALIGNMENT_META)
const ALIGNMENT_COLORS = {
  at_war: ALIGNMENT_META.at_war.color,
  pro_israel: ALIGNMENT_META.pro_israel.color,
  pro_palestine: ALIGNMENT_META.pro_palestine.color,
  pro_iran: ALIGNMENT_META.pro_iran.color,
  neutral: ALIGNMENT_META.neutral.color,
}

const ALIGNMENT_LABELS = {
  at_war: 'At War',
  pro_israel: 'Pro-Israel',
  pro_palestine: 'Pro-Palestine',
  pro_iran: 'Pro-Iran',
  neutral: 'Neutral',
}

// Strength of stance → fill opacity (full = solid, observer = faint)
const INTENSITY_OPACITY = {
  full: 0.92,
  leaning: 0.72,
  mediating: 0.55,
  observer: 0.38,
}

export default function WorldStanceMap({ countries, stanceLookup }) {
  const [hover, setHover] = useState(null)
  const [selected, setSelected] = useState(null)

  // Build stance lookup from the comprehensive dataset
  const byCode = {}
  for (const c of countries) {
    if (c.code) byCode[c.code.toLowerCase()] = c
  }
  const fullLookup = { ...(stanceLookup || {}), ...byCode }
  // US Minor Outlying Islands (um-dq, um-fq, ...) all map to the 'um' entry
  for (const key of Object.keys(fullLookup)) {
    if (key.startsWith('um-')) fullLookup[key] = fullLookup['um'] || fullLookup[key]
  }

  const lookupProfile = (id) => {
    if (fullLookup[id]) return fullLookup[id]
    if (id.startsWith('um-')) return fullLookup['um']
    return null
  }

  const hovered = hover ? lookupProfile(hover) : null
  const picked = selected ? lookupProfile(selected) : null
  const detail = picked || hovered
  const detailMeta = detail ? ALIGNMENT_META[detail.alignment] : null
  const detailIntensity = detail ? INTENSITY_META[detail.intensity] : null

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '16px',
        padding: '20px',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontWeight: 800, fontSize: '15px', color: '#111827', display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
            <Globe size={16} strokeWidth={2.2} style={{ color: '#1a6b3c' }} /> Global Alignment Map
          </div>
          <div style={{ fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: '12px', color: '#9CA3AF' }}>
            Hover to preview · click a country to pin its status
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {Object.entries(ALIGNMENT_COLORS).map(([key, color]) => {
            const count = countries.filter((c) => c.alignment === key).length
            return (
              <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#6B7280', fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                {ALIGNMENT_LABELS[key]} ({count})
              </span>
            )
          })}
        </div>
      </div>

      {/* Status readout / detail panel */}
      <div style={{
        minHeight: '34px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 4px 10px',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
      }}>
        {detail ? (
          <>
            <span style={{ fontSize: '18px' }}>{detail.flag}</span>
            <span style={{ fontWeight: 800, fontSize: '13px', color: '#111827' }}>{detail.name}</span>
            {picked && <span style={{ fontSize: '10px', color: '#9CA3AF', background: '#F3F4F6', borderRadius: '999px', padding: '1px 8px' }}>pinned ✓</span>}
            <span style={{ fontSize: '12px', fontWeight: 700, color: detailMeta?.color }}>
              {detailMeta?.label || detail.alignment}
            </span>
            {detailIntensity && (
              <span style={{
                fontSize: '10px', fontWeight: 700,
                color: detailIntensity.color,
                background: '#F3F4F6', borderRadius: '999px', padding: '1px 8px',
              }}>
                {detailIntensity.label}
              </span>
            )}
          </>
        ) : (
          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>— hover or click a country —</span>
        )}
      </div>

      <svg
        viewBox={worldMap.viewBox}
        style={{
          width: '100%',
          height: 'auto',
          borderRadius: '10px',
          background: '#F8FAFC',
        }}
      >
        {worldMap.locations.map((loc) => {
          const profile = lookupProfile(loc.id)
          const color = profile ? ALIGNMENT_COLORS[profile.alignment] : '#E5E7EB'
          const isPicked = selected === loc.id
          const isHover = hover === loc.id
          const baseOpacity = profile ? (INTENSITY_OPACITY[profile.intensity] || 0.7) : 1
          const fillOpacity = profile ? (isPicked ? 1 : isHover ? Math.min(1, baseOpacity + 0.15) : baseOpacity) : 1
          return (
            <path
              key={loc.id}
              d={loc.path}
              fill={profile ? color : '#E5E7EB'}
              fillOpacity={fillOpacity}
              stroke={isPicked ? '#111827' : isHover ? '#1a6b3c' : '#FFFFFF'}
              strokeWidth={isPicked ? 1.8 : isHover ? 1.5 : 0.6}
              onMouseEnter={() => setHover(loc.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setSelected(selected === loc.id ? null : loc.id)}
              style={{ cursor: profile ? 'pointer' : 'default', transition: 'fill 0.15s, opacity 0.15s' }}
            >
              <title>{profile ? `${profile.name} — ${ALIGNMENT_LABELS[profile.alignment]} — click to pin` : loc.name}</title>
            </path>
          )
        })}
      </svg>

      {/* Selected country details card */}
      {picked && (
        <div style={{
          marginTop: '12px',
          background: '#F8FAFC',
          border: '1px solid #E5E7EB',
          borderLeft: `3px solid ${detailMeta?.color || '#9CA3AF'}`,
          borderRadius: '12px',
          padding: '14px 16px',
          fontFamily: 'var(--font-inter), Inter, sans-serif',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '30px' }}>{picked.flag}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#111827' }}>{picked.name}</div>
              <div style={{ fontFamily: 'var(--font-space-mono), Space Mono, monospace', fontSize: '11px', color: '#9CA3AF' }}>{picked.code}</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: detailMeta?.color }}>{detailMeta?.label}</span>
              {detailIntensity && (
                <span style={{ fontSize: '10px', fontWeight: 700, color: detailIntensity.color, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '999px', padding: '1px 10px' }}>
                  {detailIntensity.label}
                </span>
              )}
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6, margin: 0 }}>{picked.summary}</p>
          <button
            onClick={() => setSelected(null)}
            style={{
              marginTop: '10px',
              background: 'none',
              border: '1px solid #E5E7EB',
              borderRadius: '999px',
              padding: '3px 12px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6B7280',
              cursor: 'pointer',
              fontFamily: 'var(--font-inter), Inter, sans-serif',
            }}
          >✕ Unpin</button>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontFamily: 'var(--font-inter), Inter, sans-serif', fontSize: '11px', color: '#9CA3AF', flexWrap: 'wrap' }}>
        <span style={{ color: '#E5E7EB' }}>•</span> Grey = no data tracked
        <span style={{ color: '#E5E7EB' }}>•</span> Color depth = stance strength (full bold → observer faint)
        <span style={{ color: '#E5E7EB' }}>•</span> Click a country for full status
      </div>
    </div>
  )
}