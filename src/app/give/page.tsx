export default function GivePage() {
  return (
    <div>
      {/* Header card */}
      <div style={{ background: 'linear-gradient(135deg, #faf7f0 0%, #f5efe3 100%)', border: '1px solid #d4c4a8', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 4px 24px rgba(44,36,22,0.07)' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#a07850', marginBottom: '0.75rem' }}>Support the Mission</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.6rem', fontWeight: 600, color: '#2c2416', marginBottom: '0.75rem', lineHeight: 1.3 }}>Partner With Us in Prayer & Giving</h2>
        <p style={{ fontFamily: "'Lora', serif", fontSize: '1rem', color: '#6b5c45', lineHeight: 1.8, margin: 0 }}>
          Your generous support makes it possible for our team to live and serve in Slovenia, one of the least evangelized nations in Europe. Every gift goes directly toward sharing the gospel, planting churches, and mobilizing prayer across this beautiful alpine nation.
        </p>
      </div>

      {/* How your gift helps */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 600, color: '#2c2416', marginBottom: '1rem' }}>How Your Gift Helps</h3>
        {[
          { icon: '🙏', text: 'Supports full-time missionaries living in Slovenia' },
          { icon: '📖', text: 'Funds outreach events and Bible distribution' },
          { icon: '⛪', text: 'Helps plant and strengthen local churches' },
          { icon: '🌍', text: 'Mobilizes global prayer for the Slovenian people' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid #e8e0d4' }}>
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <span style={{ fontSize: '0.95rem', color: '#6b5c45' }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* Give button */}
      
        href="https://www.imb.org/give/projects-teams/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', background: '#7a5c3a', color: '#faf7f0', textDecoration: 'none', borderRadius: '12px', padding: '1.1rem', textAlign: 'center' as const, fontFamily: "'Source Sans 3', sans-serif", fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em', boxShadow: '0 4px 16px rgba(122,92,58,0.3)', marginBottom: '1rem' }}
      >
        Give Now →
      </a>

      <p style={{ fontSize: '0.8rem', color: '#9c8b75', textAlign: 'center' as const, fontStyle: 'italic' }}>
        You will be directed to the IMB secure giving page.
      </p>
    </div>
  );
}