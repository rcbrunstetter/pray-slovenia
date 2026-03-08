import { createClientServer } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminDashboard() {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/admin/login");

  const supabase = await createClientServer();
  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = today.slice(0, 7) + "-01";

  let dailyTotal = 0;
  let monthlyTotal = 0;
  let allTimeTotal = 0;
  let activeRequests = 0;

  try {
    const { data: todayRow } = await supabase
      .from("daily_totals")
      .select("total")
      .eq("date", today)
      .maybeSingle();
    dailyTotal = todayRow?.total ?? 0;

    const { data: monthRows } = await supabase
      .from("daily_totals")
      .select("total")
      .gte("date", firstOfMonth);
    monthlyTotal = (monthRows ?? []).reduce((sum, r) => sum + (r.total ?? 0), 0);

    const { data: allRows } = await supabase
      .from("daily_totals")
      .select("total");
    allTimeTotal = (allRows ?? []).reduce((sum, r) => sum + (r.total ?? 0), 0);

    const { count } = await supabase
      .from("prayer_requests")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);
    activeRequests = count ?? 0;
  } catch {}

  const statBox = (label: string, value: number) => (
    <div style={{ background: '#faf7f2', border: '1px solid #d9cfc0', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, color: '#7a5c3a' }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: '#9c8b75', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );

  return (
    <>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 600, color: '#2c2416', marginBottom: '0.25rem' }}>Admin Dashboard</h1>
      <p style={{ color: '#9c8b75', fontSize: '0.9rem', marginBottom: '2rem' }}>Manage Pray Slovenia</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {statBox("Prayers Today", dailyTotal)}
        {statBox("This Month", monthlyTotal)}
        {statBox("All Time", allTimeTotal)}
        {statBox("Active Requests", activeRequests)}
      </div>

      {/* Management links */}
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 600, color: '#2c2416', marginBottom: '1rem' }}>Manage Content</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Link href="/admin/prompts" style={{ display: 'block', background: '#faf7f2', border: '1px solid #d9cfc0', borderRadius: '10px', padding: '1.1rem 1.5rem', textDecoration: 'none', color: '#2c2416' }}>
          <div style={{ fontFamily: "'Lora', serif", fontWeight: 500, fontSize: '1rem' }}>📅 Prayer Prompts</div>
          <div style={{ fontSize: '0.85rem', color: '#9c8b75', marginTop: '0.2rem' }}>Add and manage daily prayer prompts</div>
        </Link>
        <Link href="/admin/requests" style={{ display: 'block', background: '#faf7f2', border: '1px solid #d9cfc0', borderRadius: '10px', padding: '1.1rem 1.5rem', textDecoration: 'none', color: '#2c2416' }}>
          <div style={{ fontFamily: "'Lora', serif", fontWeight: 500, fontSize: '1rem' }}>🕊 Prayer Requests</div>
          <div style={{ fontSize: '0.85rem', color: '#9c8b75', marginTop: '0.2rem' }}>Post and manage urgent prayer requests</div>
        </Link>
        <Link href="/" style={{ display: 'block', background: '#faf7f2', border: '1px solid #d9cfc0', borderRadius: '10px', padding: '1.1rem 1.5rem', textDecoration: 'none', color: '#2c2416' }}>
          <div style={{ fontFamily: "'Lora', serif", fontWeight: 500, fontSize: '1rem' }}>🏠 View Public Site</div>
          <div style={{ fontSize: '0.85rem', color: '#9c8b75', marginTop: '0.2rem' }}>See what visitors see</div>
        </Link>
      </div>
    </>
  );
}