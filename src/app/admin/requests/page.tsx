import type { Metadata } from "next";
import RequestsManager from "./requests-manager";
import PageShell from "@/components/PageShell";
import { requireAdminPage } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const metadata: Metadata = { title: "Live Updates" };

export default async function RequestsPage() {
  await requireAdminPage();

  const { data } = await supabaseAdmin
    .from("prayer_requests")
    .select("id, title, content, is_urgent, is_active, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <PageShell title="Live Updates" back={{ href: "/admin", label: "Dashboard" }}>
      <RequestsManager initial={data ?? []} />
    </PageShell>
  );
}
