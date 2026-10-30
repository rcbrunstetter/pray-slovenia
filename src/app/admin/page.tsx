import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { Button, Card, CardLink, SectionTitle } from "@/components/ui";
import { requireAdminPage } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { monthBounds, todayISO } from "@/lib/time";

export const metadata: Metadata = { title: "Admin" };

const sections = [
  { href: "/admin/prompts", title: "Prayer Prompts", text: "Add and manage daily prayer prompts" },
  { href: "/admin/recurring", title: "Recurring Prompts", text: "Manage prompts that repeat every month" },
  { href: "/admin/requests", title: "Live Updates", text: "Manage active prayer requests" },
];

export default async function AdminPage() {
  await requireAdminPage();

  const today = todayISO();
  const { first, last } = monthBounds(today.slice(0, 7));

  const [{ count: todayCount }, { count: monthCount }, { count: allCount }, { count: activeRequests }] = await Promise.all([
    supabaseAdmin.from("prayer_events").select("*", { count: "exact", head: true }).eq("event_date", today),
    supabaseAdmin.from("prayer_events").select("*", { count: "exact", head: true }).gte("event_date", first).lte("event_date", last),
    supabaseAdmin.from("prayer_events").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("prayer_requests").select("*", { count: "exact", head: true }).eq("is_active", true),
  ]);

  const stats = [
    { label: "Prayers Today", value: todayCount },
    { label: "This Month", value: monthCount },
    { label: "All Time", value: allCount },
    { label: "Active Updates", value: activeRequests },
  ];

  return (
    <PageShell title="Dashboard" subtitle="Manage prayer content for Pray Slovenia">
      <section className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value }) => (
          <Card key={label} className="flex flex-col gap-1">
            <div className="text-[34px] leading-none text-label">{(value ?? 0).toLocaleString("en-US")}</div>
            <div className="font-sans text-[13px] font-medium text-meta">{label}</div>
          </Card>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <SectionTitle>Manage Content</SectionTitle>
        {sections.map(({ href, title, text }) => (
          <CardLink key={href} href={href}>
            <div className="text-[22px] leading-[1.22] font-medium dark:font-normal">{title}</div>
            <div className="mt-0.5 text-[19px] leading-[1.35] text-update">{text}</div>
          </CardLink>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-2.5">
        <Link
          href="/admin/account"
          className="flex h-10 items-center rounded-full border border-card-line px-4 font-sans text-[15px] font-medium text-ink-soft transition duration-150 hover:border-label active:scale-[0.97]"
        >
          Account
        </Link>
        <form action="/api/admin/signout" method="POST">
          <Button variant="ghost" type="submit">Sign out</Button>
        </form>
      </div>
    </PageShell>
  );
}
