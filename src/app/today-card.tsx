"use client";

import { useEffect, useState } from "react";
import { createClientBrowser } from "@/lib/supabase-browser";

type Prompt = { date: string; title: string; content: string; verse?: string | null; };

export default function TodayCard({
  prompt,
  initialTotal,
}: {
  prompt: Prompt | null;
  initialTotal: number;
}) {
  const supabase = createClientBrowser();
  const [total, setTotal] = useState(initialTotal);
  const [hasPrayed, setHasPrayed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const channel = supabase
      .channel("realtime:daily_totals")
      .on("postgres_changes", { event: "*", schema: "public", table: "daily_totals" },
        (payload) => {
          const row = payload.new as any;
          if (row?.date === new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Ljubljana" })) {
            setTotal(row.total ?? 0);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase]);

  async function onPrayClick() {
    setLoading(true);
    const res = await fetch("/api/pray", { method: "POST" });
    const json = await res.json();
    setLoading(false);
    if (res.ok && json.ok) {
      if (!json.alreadyPrayed) setTotal(t => t + 1);
      setHasPrayed(true);
    } else {
      alert(json?.error ?? "Something went wrong.");
    }
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #faf7f0 0%, #f5efe3 100%)', border: '1px solid #d4c4a8', borderRadius: '16px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 4px 24px rgba(44,36,22,0.08)', position: 'relative', overflow: 'hidden' }}>

      <div style={{ fontSize: '0.7rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a07850', marginBottom: '0.75rem' }}>
        Today's Prayer Focus
      </div>

      {prompt ? (
        <>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.3rem, 3vw, 1.65rem)', fontWeight: 600, color: '#2c2416', lineHeight: 1.3, marginBottom: '0.5rem' }}>
            {prompt.title}
          </h2>
          {prompt.verse && (
            <div style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', fontSize: '0.9rem', color: '#a07850', marginBottom: '1rem', paddingLeft: '0.75rem', borderLeft: '2px solid #c49a6c' }}>
              {prompt.verse}
            </div>
          )}
          <p style={{ fontSize: '1rem', color: '#6b5c45', lineHeight: 1.75, marginBottom: '1.5rem' }}>
            {prompt.content}
          </p>
        </>
      ) : (
        <p style={{ color: '#9c8b75', fontStyle: 'italic', marginBottom: '1.5rem' }}>
          No prayer prompt set for today yet. Check back soon.
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '1.25rem', borderTop: '1px solid #d9cfc0' }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: '0.95rem', color: '#9c8b75' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', fontWeight: 600, color: '#7a5c3a' }}>{total}</span>
          &nbsp;{total === 1 ? 'person prayed' : 'people prayed'} today
        </div>

        {hasPrayed ? (
          <span style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: '#7a5c3a', fontSize: '0.95rem' }}>
            ✦ Thank you for praying
          </span>
        ) : (
          <button
            onClick={onPrayClick}
            disabled={loading}
            style={{ background: '#7a5c3a', color: '#faf7f0', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontFamily: "'Source Sans 3', sans-serif", fontSize: '0.9rem', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, boxShadow: '0 2px 8px rgba(122,92,58,0.3)' }}
          >
            {loading ? 'Recording...' : 'I prayed today'}
          </button>
        )}
      </div>
    </div>
  );
}