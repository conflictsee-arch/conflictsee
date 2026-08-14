export default function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
        <div style={{ height: '20px', width: '80px', background: '#E5E7EB', borderRadius: '999px', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '20px', width: '60px', background: '#F3F4F6', borderRadius: '999px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <div style={{ height: '16px', width: '78%', background: '#E5E7EB', borderRadius: '6px', marginBottom: '8px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: '12px', width: '92%', background: '#F3F4F6', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
      <div style={{ height: '12px', width: '55%', background: '#F3F4F6', borderRadius: '4px', marginTop: '6px', animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  )
}