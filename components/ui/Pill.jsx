export default function Pill({ label, color, bg, border }) {
  return (
    <span
      style={{
        background: bg,
        color,
        border: border ? `1px solid ${border}` : 'none',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}