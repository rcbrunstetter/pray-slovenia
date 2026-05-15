"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

const inputStyle = { width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #d9cfc0', borderRadius: '8px', fontSize: '0.95rem', background: '#fff', color: '#2c2416', outline: 'none', boxSizing: 'border-box' as const };
const labelStyle = { display: 'block' as const, fontSize: '0.8rem', fontWeight: 500 as const, color: '#6b5c45', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' as const };

export default function ResetPasswordPage() {
  const supabase = createClientBrowser();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [invalidLink, setInvalidLink] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase exchanges the #access_token hash into a session automatically.
    // We wait one tick then check whether a recovery session actually exists.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setReady(true);
      } else {
        setInvalidLink(true);
      }
    });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: '#faf7f2', border: '1px solid #d9cfc0', borderRadius: '16px', boxShadow: '0 4px 24px rgba(44,36,22,0.08)' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 600, color: '#2c2416', marginBottom: '0.25rem' }}>Set New Password</h1>
      <p style={{ color: '#9c8b75', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Pray Slovenia team access</p>

      {invalidLink && (
        <div style={{ background: '#fdf5f2', border: '1px solid #b85c38', borderRadius: '8px', padding: '0.75rem 1rem', color: '#b85c38', fontSize: '0.9rem' }}>
          This link is invalid or has expired.{' '}
          <a href="/admin/login" style={{ color: '#b85c38', fontWeight: 500 }}>Request a new one.</a>
        </div>
      )}

      {ready && (
        <form onSubmit={onSubmit}>
          {error && (
            <div style={{ background: '#fdf5f2', border: '1px solid #b85c38', borderRadius: '8px', padding: '0.75rem 1rem', color: '#b85c38', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>New Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#7a5c3a', color: '#faf7f0', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '0.95rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Saving..." : "Set Password"}
          </button>
        </form>
      )}
    </div>
  );
}
