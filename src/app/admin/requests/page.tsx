"use client";

import { useState, useEffect } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

type Request = { id: number; title: string; content: string; is_urgent: boolean; is_active: boolean; created_at: string; };

const inputStyle = { width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #d9cfc0', borderRadius: '8px', fontSize: '0.95rem', background: '#fff', color: '#2c2416', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '0.75rem' };
const labelStyle = { display: 'block' as const, fontSize: '0.8rem', fontWeight: 500 as const, color: '#6b5c45', marginBottom: '0.3rem', letterSpacing: '0.05em', textTransform: 'uppercase' as const };

export default function RequestsPage() {
  const supabase = createClientBrowser();
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/admin/login");
    });
    supabase.from("prayer_requests").select("*").order("created_at", { ascending: false }).limit(50)
      .then(({ data }) => setRequests(data ?? []));
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, is_urgent: isUrgent }),
    });
    const json = await res.json();
    setSaving(false);
    if (res.ok && json.data) {
      setMsg("Posted!");
      setTitle(""); setContent(""); setIsUrgent(false);
      setRequests(prev => [json.data, ...prev]);
    } else {
      setMsg(json?.error ?? "Error saving");
    }
  }

  async function onToggleActive(id: number, current: boolean) {
    const res = await fetch("/api/admin/requests", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: !current }),
    });
    if (res.ok) setRequests(prev => prev.map(r => r.id === id ? { ...r, is_active: !current } : r));
  }

  async function onDelete(id: number) {
    if (!confirm("Delete this prayer request?")) return;
    const res = await fetch(`/api/admin/requests?id=${id}`, { method: "DELETE" });
    if (res.ok) setRequests(prev => prev.filter(r => r.id !== id));
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 600, color: '#2c2416', marginBottom: '0.25rem' }}>Prayer Requests</h1>
      <p style={{ color: '#9c8b75', fontSize: '0.9rem', marginBottom: '2rem' }}>
        <a href="/admin" style={{ color: '#7a5c3a' }}>← Back to dashboard</a>
      </p>

      <div style={{ background: '#faf7f2', border: '1px solid #d9cfc0', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: '1.1rem', fontWeight: 500, color: '#2c2416', marginBottom: '1.25rem' }}>Post New Request</h2>
        <form onSubmit={onSave}>
          <label style={labelStyle}>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Pray for the Novak family" style={inputStyle} />
          <label style={labelStyle}>Details</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} required placeholder="Describe the prayer need..." style={{ ...inputStyle, height: '100px', resize: 'vertical' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: '#6b5c45', marginBottom: '1rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)} />
            Mark as urgent
          </label>
          {msg && <div style={{ color: msg === 'Posted!' ? '#7a5c3a' : '#b85c38', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{msg}</div>}
          <button type="submit" disabled={saving} style={{ background: '#7a5c3a', color: '#faf7f0', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontSize: '0.9rem', fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? "Posting..." : "Post Request"}
          </button>
        </form>
      </div>

      <h2 style={{ fontFamily: "'Lora', serif", fontSize: '1.1rem', fontWeight: 500, color: '#2c2416', marginBottom: '1rem' }}>All Requests</h2>
      {requests.length === 0 && <p style={{ color: '#9c8b75', fontStyle: 'italic' }}>No requests yet.</p>}
      {requests.map(r => (
        <div key={r.id} style={{ background: r.is_active ? '#faf7f2' : '#f0ede8', border: '1px solid #d9cfc0', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '0.75rem', opacity: r.is_active ? 1 : 0.6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                {r.is_urgent && <span style={{ background: '#b85c38', color: 'white', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Urgent</span>}
                {!r.is_active && <span style={{ background: '#9c8b75', color: 'white', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>Inactive</span>}
              </div>
              <div style={{ fontFamily: "'Lora', serif", fontWeight: 500, color: '#2c2416', marginBottom: '0.3rem' }}>{r.title}</div>
              <div style={{ fontSize: '0.85rem', color: '#6b5c45' }}>{r.content}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button onClick={() => onToggleActive(r.id, r.is_active)} style={{ background: 'none', border: '1px solid #d9cfc0', borderRadius: '6px', padding: '0.3rem 0.75rem', fontSize: '0.8rem', color: '#7a5c3a', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {r.is_active ? "Deactivate" : "Activate"}
              </button>
              <button onClick={() => onDelete(r.id)} style={{ background: 'none', border: '1px solid #d9cfc0', borderRadius: '6px', padding: '0.3rem 0.75rem', fontSize: '0.8rem', color: '#b85c38', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}