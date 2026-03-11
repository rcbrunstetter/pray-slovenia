export default function GivePage() {
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #faf7f0 0%, #f5efe3 100%)', border: '1px solid #d4c4a8', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a07850', margin: '0 0 0.75rem 0' }}>Support the Mission</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 600, color: '#2c2416', marginBottom: '0.75rem', lineHeight: 1.3 }}>Partner With Us in Prayer &amp; Giving</h2>
        <p style={{ fontFamily: "'Lora', serif", fontSize: '1rem', color: '#6b5c45', lineHeight: 1.8, margin: 0 }}>Your generous support makes it possible for our team to live and serve in Slovenia, one of the least evangelized nations in Europe. Every gift goes directly toward sharing the gospel, planting churches, and mobilizing prayer across this beautiful alpine nation.</p>
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 600, color: '#2c2416', marginBottom: '1rem' }}>How Your Gift Helps</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #e8e0d4' }}>
        <span>🙏</span>
        <span style={{ fontSize: '0.95rem', color: '#6b5c45' }}>Supports full-time missionaries living in Slovenia</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #e8e0d4' }}>
        <span>📖</span>
        <span style={{ fontSize: '0.95rem', color: '#6b5c45' }}>Funds outreach events and Bible distribution</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #e8e0d4' }}>
        <span>⛪</span>
        <span style={{ fontSize: '0.95rem', color: '#6b5c45' }}>Helps plant and strengthen local churches</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #e8e0d4', marginBottom: '2rem' }}>
        <span>🌍</span>
        <span style={{ fontSize: '0.95rem', color: '#6b5c45' }}>Mobilizes global prayer for the Slovenian people</span>
      </div>
      <a href="https://www.imb.org/give/projects-teams/" target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#7a5c3a', color: '#faf7f0', textDecoration: 'none', borderRadius: '12px', padding: '1.1rem', textAlign: 'center', fontFamily: "'Source Sans 3', sans-serif", fontSize: '1rem', fontWeight: 600, boxShadow: '0 4px 16px rgba(122,92,58,0.3)', marginBottom: '1rem' }}>
        Give Now →
      </a>
      <p style={{ fontSize: '0.8rem', color: '#9c8b75', textAlign: 'center', fontStyle: 'italic' }}>
        You will be directed to the IMB secure giving page.
      </p>
    </div>
  );
}