"use client";

import { useState } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

const inputStyle = { width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #d9cfc0', borderRadius: '8px', fontSize: '0.95rem', background: '#fff', color: '#2c2416', outline: 'none', boxSizing: 'border-box' as const };
const labelStyle = { display: 'block' as const, fontSize: '0.8rem', fontWeight: 500 as const, color: '#6b5c45', marginBottom: '0.4rem', letterSpacing: '0.05em', textTransform: 'uppercase' as const };

export default function AccountPage() {
  const supabase = createClientBrowser();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

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
      if (error.message.includes("Auth session missing")) {
        router.push("/admin/login");
        return;
      }
      setError(error.message);
    } else {
      setPassword("");
      setConfirm("");
      setSuccess(true);
    }
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '2rem 1rem' }}>
      <a href="/admin" style={{ color: '#7a5c3a', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>← Back to dashboard</a>

      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 600, color: '#2c2416', marginBottom: '0.25rem' }}>Account</h1>
      <p style={{ color: '#9c8b75', fontSize: '0.9rem', marginBottom: '2rem' }}>Manage your admin account settings</p>

      <div style={{ background: '#faf7f0', border: '1px solid #d9cfc0', borderRadius: '12px', padding: '1.5rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#2c2416', marginBottom: '1.25rem' }}>Change Password</h2>

        <form onSubmit={onSubmit}>
          {error && (
            <div style={{ background: '#fdf5f2', border: '1px solid #b85c38', borderRadius: '8px', padding: '0.75rem 1rem', color: '#b85c38', fontSize: '0.9rem', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#f2f7f2', border: '1px solid #7a5c3a', borderRadius: '8px', padding: '0.75rem 1rem', color: '#7a5c3a', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Password updated successfully.
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
            style={{ background: '#7a5c3a', color: '#faf7f0', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontSize: '0.95rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Saving..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
