"use client";

import { useState, useEffect } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

type Prompt = { date: string; title: string; content: string; verse?: string | null; };

const inputStyle = { width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #d9cfc0', borderRadius: '8px', fontSize: '0.95rem', background: '#fff', color: '#2c2416', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '0.75rem' };
const labelStyle = { display: 'block' as const, fontSize: '0.8rem', fontWeight: 500 as const, color: '#6b5c45', marginBottom: '0.3rem', letterSpacing: '0.05em', textTransform: 'uppercase' as const };

export default function PromptsPage() {
  const supabase = createClientBrowser();
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [verse, setVerse] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/admin/login");
    });
    supabase.from("prayer_prompts").select("*").order("date", { ascending: false }).limit(60)
      .then(({ data }) => setPrompts(data ?? []));
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, title, content, verse }),
    });
    const json = await res.json();
    setSaving(false);
    if (res.ok) {
      setMsg("Saved!");
      setDate(""); setTitle(""); setContent(""); setVerse("");
      setPrompts(prev => [{ date, title, content, verse }, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
    } else {
      setMsg(json?.error ?? "Error saving");
    }
  }

  async function onDelete(d: string) {
    if (!confirm(`Delete prompt for ${d}?`)) return;
    const res = await fetch(`/api/admin/prompts?date=${d}`, { method: "DELETE" });
    if (res.ok) setPrompts(prev => prev.filter(p => p.date !== d));
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 600, color: '#2c2416', marginBottom: '0.25rem' }}>Prayer Prompts</h1>
      <p style={{ color: '#9c8b75', fontSize: '0.9rem', marginBottom: '2rem' }}>
        <a href="/admin" style={{ color: '#7a5c3a' }}>← Back to dashboard</a>
      </p>

      <div style={{ background: '#faf7f2', border: '1px solid #d9cfc0', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Lora', serif", fontSize: '1.1rem', fontWeight: 500, color: '#2c2416', marginBottom: '1.25rem' }}>Add New Prompt</h2>
        <form onSubmit={onSave}>
          <label style={labelStyle}>Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required style={inputStyle} />
          <label style={labelStyle}>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Pray for the youth" style={inputStyle} />
          <label style={labelStyle}>Scripture (optional)</label>
          <input type="text" value={verse} onChange={e => setVerse(e.target.value)} placeholder="e.g. Psalm 133:1" style={inputStyle} />
          <label style={labelStyle}>Prayer Content</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} required placeholder="Write the prayer focus..." style={{ ...inputStyle, height: '120px', resize: 'vertical' }} />
          {msg && <div style={{ color: msg === 'Saved!' ? '#7a5c3a' : '#b85c38', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{msg}</div>}
          <button type="submit" disabled={saving} style={{ background: '#7a5c3a', color: '#faf7f0', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontSize: '0.9rem', fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving..." : "Save Prompt"}
          </button>
        </form>
      </div>

      <h2 style={{ fontFamily: "'Lora', serif", fontSize: '1.1rem', fontWeight: 500, color: '#2c2416', marginBottom: '1rem' }}>Existing Prompts</h2>
      {prompts.length === 0 && <p style={{ color: '#9c8b75', fontStyle: 'italic' }}>No prompts yet.</p>}
      {prompts.map(p => (
        <div key={p.date} style={{ background: '#faf7f2', border: '1px solid #d9cfc0', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#9c8b75', marginBottom: '0.2rem' }}>{p.date}</div>
            <div style={{ fontFamily: "'Lora', serif", fontWeight: 500, color: '#2c2416' }}>{p.title}</div>
            {p.verse && <div style={{ fontSize: '0.85rem', color: '#a07850', fontStyle: 'italic' }}>{p.verse}</div>}
          </div>
          <button onClick={() => onDelete(p.date)} style={{ background: 'none', border: '1px solid #d9cfc0', borderRadius: '6px', padding: '0.3rem 0.75rem', fontSize: '0.8rem', color: '#b85c38', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}