import { createClientServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminPage() {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  const firstOfMonth = today.slice(0, 7) + "-01";
  const lastOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    .toLocaleDateString("en-CA", { timeZone: "America/New_York" });

  const [{ count: todayCount }, { count: monthCount }, { count: allCount }, { count: activeRequests }] = await Promise.all([
    supabaseAdmin.from("prayer_events").select("*", { count: "exact", head: true }).eq("event_date", today),
    supabaseAdmin.from("prayer_events").select("*", { count: "exact", head: true }).gte("event_date", firstOfMonth).lte("event_date", lastOfMonth),
    supabaseAdmin.from("prayer_events").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("prayer_requests").select("*", { count: "exact", head: true }).eq("is_active", true),
  ]);

  const statBox = (label: string, value: number | null) => (
    <div style={{ background: '#faf7f0', border: '1px solid #d9cfc0', borderRadius: '12px', padding: '1.25rem', textAlign: 'center' as const }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 600, color: '#7a5c3a' }}>{value ?? 0}</div>
      <div style={{ fontSize: '0.8rem', color: '#9c8b75', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 600, color: '#2c2416', marginBottom: '0.25rem' }}>Admin Dashboard</h1>
      <p style={{ color: '#9c8b75', fontSize: '0.9rem', marginBottom: '2rem' }}>Manage prayer content for Pray Slovenia</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
        {statBox("Prayers Today", todayCount)}
        {statBox("This Month", monthCount)}
        {statBox("All Time", allCount)}
        {statBox("Active Requests", activeRequests)}
      </div>

      {/* Links */}
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#2c2416', marginBottom: '1rem' }}>Manage Content</h2>

      <a href="/admin/prompts" style={{ display: 'block', background: '#faf7f0', border: '1px solid #d9cfc0', borderRadius: '10px', padding: '1rem 1.25rem', textDecoration: 'none', color: '#2c2416', marginBottom: '0.75rem' }}>
        <div style={{ fontWeight: 500, marginBottom: '0.2rem' }}>📅 Prayer Prompts</div>
        <div style={{ fontSize: '0.85rem', color: '#9c8b75' }}>Add and manage daily prayer prompts</div>
      </a>

      <a href="/admin/recurring" style={{ display: 'block', background: '#faf7f0', border: '1px solid #d9cfc0', borderRadius: '10px', padding: '1rem 1.25rem', textDecoration: 'none', color: '#2c2416', marginBottom: '0.75rem' }}>
        <div style={{ fontWeight: 500, marginBottom: '0.2rem' }}>🔁 Recurring Prompts</div>
        <div style={{ fontSize: '0.85rem', color: '#9c8b75' }}>Manage prompts that repeat every month</div>
      </a>

      <a href="/admin/requests" style={{ display: 'block', background: '#faf7f0', border: '1px solid #d9cfc0', borderRadius: '10px', padding: '1rem 1.25rem', textDecoration: 'none', color: '#2c2416', marginBottom: '0.75rem' }}>
        <div style={{ fontWeight: 500, marginBottom: '0.2rem' }}>🕊 Live Updates</div>
        <div style={{ fontSize: '0.85rem', color: '#9c8b75' }}>Manage active prayer requests</div>
      </a>

      <a href="/" style={{ display: 'block', background: 'none', border: '1px solid #d9cfc0', borderRadius: '10px', padding: '1rem 1.25rem', textDecoration: 'none', color: '#9c8b75', marginBottom: '0.75rem', textAlign: 'center' as const, fontSize: '0.9rem' }}>
        ← View Public Site
      </a>

      {/* Account + Sign out */}
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <a href="/admin/account" style={{ color: '#9c8b75', fontSize: '0.85rem', textDecoration: 'underline' }}>Account</a>
        <form action="/api/admin/signout" method="POST">
          <button type="submit" style={{ background: 'none', border: 'none', color: '#9c8b75', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}