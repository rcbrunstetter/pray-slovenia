"use client";

import { useState } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

const inputStyle = { width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #d9cfc0', borderRadius: '8px', fontSize: '0.95rem', background: '#fff', color: '#2c2416', outline: 'none', boxSizing: 'border-box' as const };
const labelStyle = { display: 'block' as const, fontSize: '0.8rem', fontWeight: 500 as const, color: '#6b5c45', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' as const };

export default function AdminLogin() {
  const supabase = createClientBrowser();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

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

  async function onForgotPassword() {
    if (!email) {
      setError("Enter your email address above, then click 'Forgot password?'");
      return;
    }
    setResetLoading(true);
    setError("");
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setResetLoading(false);
    setResetSent(true);
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

      {resetSent ? (
        <div style={{ background: '#f2f7f2', border: '1px solid #7a5c3a', borderRadius: '8px', padding: '0.75rem 1rem', color: '#7a5c3a', fontSize: '0.9rem' }}>
          Password reset email sent. Check your inbox.
        </div>
      ) : (
        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
            <button
              type="button"
              onClick={onForgotPassword}
              disabled={resetLoading}
              style={{ background: 'none', border: 'none', color: '#9c8b75', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
            >
              {resetLoading ? "Sending..." : "Forgot password?"}
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#7a5c3a', color: '#faf7f0', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '0.95rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      )}
    </div>
  );
}