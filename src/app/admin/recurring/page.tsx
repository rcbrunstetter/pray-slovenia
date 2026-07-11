"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

type Recurring = { id: string; day_of_month: number; title: string; content: string; verse?: string | null; };

export default function RecurringPage() {
  const supabase = createClientBrowser();
  const router = useRouter();
  const [items, setItems] = useState<Recurring[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({ day_of_month: '', title: '', content: '', verse: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.push("/admin/login");
    });
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data } = await supabase.from("recurring_prompts").select("*").order("day_of_month");
    setItems(data ?? []);
  }

  async function handleAdd() {
    if (!form.day_of_month || !form.title || !form.content) return alert("Day, title and content are required.");
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/admin/recurring", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, day_of_month: parseInt(form.day_of_month) }),
    });
    const json = await res.json();
    setLoading(false);
    if (res.ok) {
      setMsg("Saved!");
      setForm({ day_of_month: '', title: '', content: '', verse: '' });
      fetchItems();
    } else {
      console.error("recurring insert failed:", json);
      setMsg(json?.error ?? "Error saving");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this recurring prompt?")) return;
    await fetch("/api/admin/recurring", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchItems();
  }

  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 500, color: '#6b5c45', marginBottom: '0.3rem', textTransform: 'uppercase' as const, letterSpacing: '0.05em' };
  const inputStyle = { width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #d9cfc0', borderRadius: '8px', fontSize: '0.95rem', background: '#faf7f2', color: '#2c2416', boxSizing: 'border-box' as const, fontFamily: 'inherit' };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem' }}>
      <a href="/admin" style={{ color: '#7a5c3a', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>← Back to dashboard</a>

      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 600, color: '#2c2416', marginBottom: '0.5rem' }}>Recurring Prompts</h1>
      <p style={{ color: '#9c8b75', fontSize: '0.9rem', marginBottom: '2rem' }}>These automatically fill in every month on the day you set. Manual prompts always take priority.</p>

      {/* Add form */}
      <div style={{ background: '#faf7f0', border: '1px solid #d9cfc0', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#2c2416', marginBottom: '1.25rem' }}>Add Recurring Prompt</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Day of Month</label>
          <input
            type="number"
            min="1"
            max="31"
            placeholder="e.g. 1 for the 1st of every month"
            value={form.day_of_month}
            onChange={e => setForm(f => ({ ...f, day_of_month: e.target.value }))}
            style={{ ...inputStyle, width: '200px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Title</label>
          <input
            type="text"
            placeholder="Prayer focus title"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Scripture (optional)</label>
          <input
            type="text"
            placeholder="e.g. Psalm 122:6"
            value={form.verse}
            onChange={e => setForm(f => ({ ...f, verse: e.target.value }))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Content</label>
          <textarea
            placeholder="Prayer prompt content..."
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        {msg && <div style={{ color: msg === 'Saved!' ? '#7a5c3a' : '#b85c38', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{msg}</div>}
        <button
          onClick={handleAdd}
          disabled={loading}
          style={{ background: '#7a5c3a', color: '#faf7f0', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Adding..." : "Add Recurring Prompt"}
        </button>
      </div>

      {/* List */}
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#2c2416', marginBottom: '1rem' }}>Active Recurring Prompts</h2>
      {items.length === 0 && (
        <p style={{ color: '#9c8b75', fontStyle: 'italic' }}>No recurring prompts yet.</p>
      )}
      {items.map(item => (
        <div key={item.id} style={{ background: '#faf7f2', border: '1px solid #d9cfc0', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
              <span style={{ background: '#7a5c3a', color: '#faf7f0', borderRadius: '6px', padding: '0.15rem 0.6rem', fontSize: '0.75rem', fontWeight: 600 }}>
                Day {item.day_of_month}
              </span>
              <span style={{ fontFamily: "'Lora', serif", fontWeight: 500, color: '#2c2416' }}>{item.title}</span>
            </div>
            {item.verse && <div style={{ fontSize: '0.8rem', color: '#a07850', fontStyle: 'italic', marginBottom: '0.25rem' }}>{item.verse}</div>}
            <div style={{ fontSize: '0.85rem', color: '#6b5c45', lineHeight: 1.5 }}>{item.content.length > 120 ? item.content.slice(0, 120) + '…' : item.content}</div>
          </div>
          <button
            onClick={() => handleDelete(item.id)}
            style={{ background: 'none', border: '1px solid #d9cfc0', borderRadius: '6px', padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#b85c38', cursor: 'pointer', flexShrink: 0 }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}