export default function TeamPage() {
  const mission = "Pray Slovenia exists to mobilize believers around the world to intercede for the nation of Slovenia — one of the least evangelized countries in Europe. Through daily prayer, we believe God is moving in the hearts of the Slovenian people, and that a great awakening is coming to this beautiful alpine nation.";

  const team = [
    { name: "The Manley Family", roles: ["Team Leaders","Church Planters"], photo: null },
    { name: "The Bell Family", roles: ["Church Planters"], photo: "/team/Bells.JPG" },
    { name: "The Brunstetter Family", roles: ["Church Planters", "Student Strategists"], photo: "/team/Brunstetter-Family.JPG" },
    { name: "The Bates Family", roles: ["Church Planters"], photo: null },
    { name: "Josh Johnston", roles: ["Church Planter"], photo: "/team/Josh.JPG" },
  ];

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #faf7f0 0%, #f5efe3 100%)', border: '1px solid #d4c4a8', borderRadius: '16px', padding: '2rem', marginBottom: '2.5rem', boxShadow: '0 4px 24px rgba(44,36,22,0.07)' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a07850', marginBottom: '0.75rem' }}>Our Mission</div>
        <p style={{ fontFamily: "'Lora', serif", fontSize: '1.05rem', color: '#2c2416', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
          "{mission}"
        </p>
      </div>

      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#2c2416', marginBottom: '1.5rem', textAlign: 'center' }}>
        Meet the Team
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {team.map((member, index) => (
          <div key={index} style={{ background: '#faf7f2', border: '1px solid #d9cfc0', borderRadius: '14px', overflow: 'hidden', textAlign: 'center' }}>
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name}
                style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{ width: '100%', height: '180px', background: 'linear-gradient(135deg, #c49a6c, #7a5c3a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: '#faf7f0', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
                {member.name.charAt(0)}
              </div>
            )}
            <div style={{ padding: '1rem' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, fontSize: '0.95rem', color: '#2c2416', marginBottom: '0.4rem' }}>{member.name}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', justifyContent: 'center' }}>
                {member.roles.map((role, i) => (
                  <span key={i} style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#faf7f0', background: '#a07850', borderRadius: '4px', padding: '0.15rem 0.5rem' }}>{role}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}