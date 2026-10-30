import type { Metadata } from "next";
import CalendarView from "./calendar-view";
import { createClientServer } from "@/lib/supabase-server";
import { monthBounds, todayISO } from "@/lib/time";

export const metadata: Metadata = { title: "Calendar" };

export default async function CalendarPage() {
  const supabase = await createClientServer();
  const today = todayISO();
  const { first, last } = monthBounds(today.slice(0, 7));

  const [manual, recurring] = await Promise.all([
    supabase.from("prayer_prompts").select("*").gte("date", first).lte("date", last),
    supabase.from("recurring_prompts").select("*"),
  ]);

  if (manual.error || recurring.error) {
    throw new Error("Failed to load calendar prompts");
  }

  return <CalendarView today={today} manual={manual.data ?? []} recurring={recurring.data ?? []} />;
}
