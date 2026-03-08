import { createClientServer } from "@/lib/supabase-server";
import TodayCard from "./today-card";
import Link from "next/link";
import NotificationPrompt from "@/components/NotificationPrompt";

export default async function Home() {
  const supabase = await createClientServer();
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Ljubljana" });

  let prompt: any = null;
  let total = 0;
  let prayerRequests: any[] = [];

  try {
    const { data: p } = await supabase
      .from("prayer_prompts")
      .select("*")
      .eq("date", today)
      .maybeSingle();
    prompt = p ?? null;

    const { data: totalRow } = await supabase
      .from("daily_totals")
      .select("*")
      .eq("date", today)
      .maybeSingle();
    total = totalRow?.total ?? 0;

    const { data: requests } = await supabase
      .from("prayer_requests")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(10);
    prayerRequests = requests ?? [];
  } catch {}

  return (
    <>
      <NotificationPrompt />

      <TodayCard prompt={prompt} initialTotal={total} />

      <Link href="/calendar" style={{ display: 'block', textAlign: 'center', color: '#9c8b75', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '2.5rem', paddingBottom: '2rem', borderBottom: '1px solid #e8e0d4' }}>
        View full month calendar →
      </Link>

      {prayerRequests.length > 0 && (
        <section>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 600, color: '#2c2416', marginBottom: '1.25rem', textAlign: 'center' }}>
            Prayer Requests Outside of the Calendar
          </h2>
          {prayerRequests.map((req, index) => (
            <div key={req.id} style={{
              background: index === 0 ? 'linear-gradient(135deg, #faf7f0 0%, #f5efe3 100%)' : '#faf7f2',
              border: `1px solid ${req.is_urgent ? '#c4856a' : '#d9cfc0'}`,
              borderRadius: index === 0 ? '14px' : '10px',
              padding: index === 0 ? '1.5rem' : '1rem 1.25rem',
              marginBottom: index === 0 ? '1rem' : '0.6rem',
              borderLeft: `${index === 0 ? '4px' : '3px'} solid ${req.is_urgent ? '#b85c38' : '#c49a6c'}`,
              boxShadow: index === 0 ? '0 4px 16px rgba(44,36,22,0.08)' : 'none',
            }}>
              {req.is_urgent && (
                <div style={{ display: 'inline-block', background: '#b85c38', color: 'white', fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', borderRadius: '4px', marginBottom: '0.5rem' }}>
                  Urgent
                </div>
              )}
              <div style={{ fontFamily: "'Lora', serif", fontWeight: 500, fontSize: index === 0 ? '1.1rem' : '0.95rem', color: '#2c2416', marginBottom: '0.35rem' }}>
                {req.title}
              </div>
              <div style={{ fontSize: index === 0 ? '0.95rem' : '0.85rem', color: '#6b5c45', lineHeight: 1.6 }}>
                {req.content}
              </div>
              {index === 0 && (
                <div style={{ fontSize: '0.75rem', color: '#9c8b75', marginTop: '0.75rem' }}>
                  {new Date(req.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {prayerRequests.length === 0 && (
        <p style={{ color: '#9c8b75', fontStyle: 'italic', fontSize: '0.95rem', textAlign: 'center' }}>
          No active prayer requests right now.
        </p>
      )}
    </>
  );
}