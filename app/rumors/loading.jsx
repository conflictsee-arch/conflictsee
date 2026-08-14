export default function Loading() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-inter), Inter, sans-serif',
      color: '#9ca3af',
      fontSize: '14px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spin" style={{
          width: '32px',
          height: '32px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #1a6b3c',
          borderRadius: '50%',
          margin: '0 auto 12px'
        }} />
        Loading...
      </div>
    </div>
  )
}
