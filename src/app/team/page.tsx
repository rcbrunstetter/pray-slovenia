export default function TeamPage() {
  const mission = "Pray Slovenia exists to mobilize believers around the world to intercede for the nation of Slovenia — one of the least evangelized countries in Europe. Through daily prayer, we believe God is moving in the hearts of the Slovenian people, and that a great awakening is coming to this beautiful alpine nation.";

  const team = [
    { name: "The Manley Family", role: "Field Team", bio: "Serving on the ground in Slovenia, the Manley family is committed to building relationships and sharing the gospel in their community." },
    { name: "The Bell Family", role: "Field Team", bio: "The Bell family brings a heart for discipleship and church planting, working faithfully to see Slovenians come to know Christ." },
    { name: "The Brunstetter Family", role: "Field Team", bio: "Passionate about prayer and mobilization, the Brunstetter family helps connect the global church to what God is doing in Slovenia." },
    { name: "The Bates Family", role: "Field Team", bio: "The Bates family serves with joy and dedication, investing in the next generation of Slovenian believers." },
    { name: "Josh Johnston", role: "Field Team", bio: "Josh brings energy and creativity to the team, engaging Slovenians through relationship and the power of the Holy Spirit." },
  ];

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #faf7f0 0%, #f5efe3 100%)', border: '1px solid #d4c4a8', borderRadius: '16px', padding: '2rem', marginBottom: '2.5rem', boxShadow: '0 4px 24px rgba(44,36,22,0.07)' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a07850', marginBottom: '0.75rem' }}>Our Mission</div>
        <p style={{ fontFamily: "'Lora', serif", fontSize: '1.05rem', color: '#2c2416', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
          "{mission}"
        </p>
      </div>

      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#2c2416', marginBottom: '1.25rem', textAlign: 'center' }}>
        Meet the Team
      </h2>

      {team.map((member, index) => (
        <div key={index} style={{ background: '#faf7f2', border: '1px solid #d9cfc0', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '0.75rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #c49a6c, #7a5c3a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem', color: '#faf7f0', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            {member.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '1rem', color: '#2c2416', marginBottom: '0.15rem' }}>{member.name}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a07850', marginBottom: '0.4rem' }}>{member.role}</div>
            <div style={{ fontSize: '0.9rem', color: '#6b5c45', lineHeight: 1.6 }}>{member.bio}</div>
          </div>
        </div>
      ))}
    </div>
  );
}