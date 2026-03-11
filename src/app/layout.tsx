import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pray Slovenia",
  description: "Join believers around the world in praying for Slovenia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400&family=Source+Sans+3:wght@300;400;500&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#7a5c3a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pray Slovenia" />
      </head>
      <body style={{ backgroundColor: '#f5f0e8', color: '#2c2416', fontFamily: "'Source Sans 3', sans-serif", lineHeight: '1.7', minHeight: '100vh', margin: 0, padding: 0 }}>
        <header style={{ position: 'relative', background: 'linear-gradient(180deg, #c8b89a 0%, #b8a882 40%, #a89470 100%)', padding: '3rem 1.5rem 5rem', overflow: 'hidden', textAlign: 'center' }}>
          <svg style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', opacity: 0.25 }} viewBox="0 0 1440 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,160 L0,100 L80,60 L160,90 L260,30 L360,80 L420,50 L500,85 L580,20 L680,70 L760,40 L840,75 L920,15 L1020,65 L1100,35 L1180,70 L1260,45 L1360,80 L1440,55 L1440,160 Z" fill="#2c2416"/>
          </svg>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, color: '#2c2416', letterSpacing: '-0.02em', lineHeight: 1.1, position: 'relative', zIndex: 1 }}>Pray Slovenia</h1>
          <p style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: '#4a3c2a', fontSize: '1rem', marginTop: '0.4rem', position: 'relative', zIndex: 1, opacity: 0.85 }}>"Every great work of God started with prayer. Every great work of God ended with a lack there of."</p>
        </header>

        <nav style={{ background: '#7a5c3a', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 8px rgba(44,36,22,0.15)' }}>
          {[
            { href: '/', label: 'Today' },
            { href: '/calendar', label: 'Calendar' },
            { href: '/team', label: 'Our Team' },
            { href: '/give', label: 'Give' },
          ].map(({ href, label }) => (
            <a key={href} href={href} style={{ color: '#f5f0e8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.75rem 1.1rem', display: 'block' }}>{label}</a>
          ))}
        </nav>

        <main style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>
          {children}
        </main>

        <footer style={{ textAlign: 'center', padding: '2rem', color: '#9c8b75', fontSize: '0.8rem', borderTop: '1px solid #d9cfc0', fontFamily: "'Source Sans 3', sans-serif" }}>
          Pray Slovenia · Lifting up a nation in prayer
          <br />
          <a href="/admin" style={{ color: '#c4b8a8', fontSize: '0.75rem', textDecoration: 'none', marginTop: '0.5rem', display: 'inline-block' }}>Admin</a>
        </footer>
      </body>
    </html>
  );
}