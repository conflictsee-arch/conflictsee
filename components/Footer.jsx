export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e5e7eb',
      padding: '40px 32px',
      marginTop: '64px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px'
      }}>
        {/* Column 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: '#1a6b3c',
              borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#ffffff', fontWeight: 700, fontSize: '12px' }}>CS</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '16px', color: '#1a6b3c' }}>ConflictSee</span>
          </div>
          <p style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontSize: '13px',
            color: '#6b7280',
            lineHeight: 1.6
          }}>
            Real-time Iran-Israel war intelligence dashboard.
          </p>
        </div>

        {/* Column 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontWeight: 600, fontSize: '13px', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sections</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['Timeline', 'Economics', 'World Affairs', 'Rumors'].map(link => (
              <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} style={{
                fontFamily: 'var(--font-inter), Inter, sans-serif',
                fontSize: '14px',
                color: '#6b7280',
                textDecoration: 'none',
              }} className="footer-link">
                {link}
              </a>
            ))}
          </div>
        </div>

        {/* Column 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h4 style={{ fontWeight: 600, fontSize: '13px', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Data & Sources</h4>
          <p style={{
            fontFamily: 'var(--font-inter), Inter, sans-serif',
            fontSize: '13px',
            color: '#6b7280',
            lineHeight: 1.6
          }}>
            Data is aggregated and fact-checked in real-time. Prices are indicative only.
          </p>
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <span style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              fontSize: '12px',
              color: '#9ca3af',
            }}>
              © {new Date().getFullYear()} ConflictSee. All rights reserved.
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: #1a6b3c !important;
        }
      `}</style>
    </footer>
  )
}
