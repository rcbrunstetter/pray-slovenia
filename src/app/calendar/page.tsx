"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";

type Prompt = { date: string; title: string; content: string; verse?: string | null; };

export default function CalendarPage() {
  const supabase = createClientBrowser();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selected, setSelected] = useState<Prompt | null>(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Ljubljana" });

  useEffect(() => {
    const firstDay = `${year}-${String(month + 1).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month + 1, 0);
    const lastDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;
    const daysInThisMonth = lastDay.getDate();

    Promise.all([
      supabase.from("prayer_prompts").select("*").gte("date", firstDay).lte("date", lastDayStr),
      supabase.from("recurring_prompts").select("*")
    ]).then(([{ data: manual }, { data: recurring }]) => {
      const manualMap = Object.fromEntries((manual ?? []).map(p => [p.date, p]));
      const merged: Prompt[] = [...(manual ?? [])];

      (recurring ?? []).forEach(r => {
        if (r.day_of_month <= daysInThisMonth) {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(r.day_of_month).padStart(2, '0')}`;
          if (!manualMap[dateStr]) {
            merged.push({ date: dateStr, title: r.title, content: r.content, verse: r.verse });
          }
        }
      });

      setPrompts(merged);
    });
  }, [year, month, supabase]);

  const monthName = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const promptMap = Object.fromEntries(prompts.map(p => [p.date, p]));

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} style={{ minWidth: 0 }} />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const prompt = promptMap[dateStr];
    const isToday = dateStr === today;
    const isPast = dateStr < today;

    days.push(
      <div
        key={dateStr}
        onClick={() => prompt && setSelected(prompt)}
        style={{
          background: isToday ? '#7a5c3a' : prompt ? '#faf7f0' : '#f0ece4',
          border: `1px solid ${isToday ? '#7a5c3a' : '#d9cfc0'}`,
          borderRadius: '8px',
          padding: '0.5rem',
          minHeight: '90px',
          minWidth: 0,
          overflow: 'hidden',
          cursor: prompt ? 'pointer' : 'default',
          opacity: isPast && !isToday ? 0.75 : 1,
          transition: 'transform 0.1s, box-shadow 0.1s',
          position: 'relative' as const,
          display: 'flex',
          flexDirection: 'column' as const,
        }}
        onMouseEnter={e => { if (prompt) { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(44,36,22,0.12)'; }}}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}
      >
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: isToday ? '#f5f0e8' : '#9c8b75', marginBottom: '0.3rem', flexShrink: 0 }}>{d}</div>
        {prompt && (
          <div style={{ fontSize: '0.68rem', color: isToday ? '#f5efe3' : '#5a4a35', lineHeight: 1.35, fontFamily: "'Lora', serif", overflow: 'hidden', flex: 1, wordBreak: 'break-word' as const }}>
            {prompt.title}
          </div>
        )}
        {prompt && (
          <div style={{ fontSize: '0.55rem', color: isToday ? '#d4b896' : '#b8a898', marginTop: '0.3rem', fontStyle: 'italic', flexShrink: 0 }}>
            tap to read ›
          </div>
        )}
        {!prompt && (
          <div style={{ fontSize: '0.6rem', color: '#c4b8a8', fontStyle: 'italic' }}>—</div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <a href="/" style={{ color: '#7a5c3a', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>← Back to today</a>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <button onClick={prevMonth} style={{ background: 'none', border: '1px solid #d9cfc0', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', color: '#7a5c3a', fontSize: '1rem' }}>←</button>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', fontWeight: 600, color: '#2c2416' }}>{monthName}</h1>
        <button onClick={nextMonth} style={{ background: 'none', border: '1px solid #d9cfc0', borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', color: '#7a5c3a', fontSize: '1rem' }}>→</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '0.3rem', marginBottom: '0.3rem' }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 500, color: '#9c8b75', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '0.25rem 0' }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: '0.3rem', marginBottom: '2rem' }}>
        {days}
      </div>

      <p style={{ fontSize: '0.8rem', color: '#9c8b75', fontStyle: 'italic', textAlign: 'center' }}>
        Tap a day to read the full prayer prompt
      </p>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(44,36,22,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#faf7f0', borderRadius: '16px', padding: '2rem', maxWidth: '480px', width: '100%', boxShadow: '0 8px 40px rgba(44,36,22,0.2)', maxHeight: '80vh', overflowY: 'auto' }}
          >
            <div style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a07850', marginBottom: '0.5rem' }}>
              {new Date(selected.date + 'T00:00:00').toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 600, color: '#2c2416', marginBottom: '0.5rem' }}>{selected.title}</h2>
            {selected.verse && (
              <div style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.9rem', color: '#a07850', marginBottom: '1rem', paddingLeft: '0.75rem', borderLeft: '2px solid #c49a6c' }}>
                {selected.verse}
              </div>
            )}
            <p style={{ fontSize: '1rem', color: '#6b5c45', lineHeight: 1.75, marginBottom: '1.5rem' }}>{selected.content}</p>
            <button
              onClick={() => setSelected(null)}
              style={{ background: '#7a5c3a', color: '#faf7f0', border: 'none', borderRadius: '8px', padding: '0.6rem 1.5rem', fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}