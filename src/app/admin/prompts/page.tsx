import type { Metadata } from "next";
import PromptsManager from "./prompts-manager";
import PageShell from "@/components/PageShell";
import { requireAdminPage } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const metadata: Metadata = { title: "Prayer Prompts" };

export default async function PromptsPage() {
  await requireAdminPage();

  const { data } = await supabaseAdmin
    .from("prayer_prompts")
    .select("date, title, content, verse")
    .order("date", { ascending: false })
    .limit(200);

  return (
    <PageShell title="Prayer Prompts" back={{ href: "/admin", label: "Dashboard" }}>
      <PromptsManager initial={data ?? []} />
    </PageShell>
  );
}
