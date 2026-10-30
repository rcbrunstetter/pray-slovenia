import type { Metadata } from "next";
import RecurringManager from "./recurring-manager";
import PageShell from "@/components/PageShell";
import { requireAdminPage } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const metadata: Metadata = { title: "Recurring Prompts" };

export default async function RecurringPage() {
  await requireAdminPage();

  const { data } = await supabaseAdmin
    .from("recurring_prompts")
    .select("id, day_of_month, title, content, verse")
    .order("day_of_month");

  return (
    <PageShell title="Recurring Prompts" back={{ href: "/admin", label: "Dashboard" }}>
      <p className="text-[19px] leading-[1.48] text-update">
        These automatically fill in every month on the day you set. Manual prompts always take priority.
      </p>
      <RecurringManager initial={data ?? []} />
    </PageShell>
  );
}
