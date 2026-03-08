"use client";

import { useState } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const supabase = createClientBrowser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: '#faf7f2', border: '1px solid #d9cfc0', borderRadius: '16px', boxShadow: '0 4px 24px rgba(44,36,22,0.08)' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 600, color: '#2c2416', marginBottom: '0.25rem' }}>Admin Login</h1>
      <p style={{ color: '#9c8b75', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Pray Slovenia team access</p>

      {error && (
        <div style={{ background: '#fdf5f2', border: '1px solid #b85c38', borderRadius: '8px', padding: '0.75rem 1rem', color: '#b85c38', fontSize: '0.9rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#6b5c45', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #d9cfc0', borderRadius: '8px', fontSize: '0.95rem', background: '#fff', color: '#2c2416', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#6b5c45', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #d9cfc0', borderRadius: '8px', fontSize: '0.95rem', background: '#fff', color: '#2c2416', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', background: '#7a5c3a', color: '#faf7f0', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '0.95rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}