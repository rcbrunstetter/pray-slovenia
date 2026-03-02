// src/app/page.tsx
import { createClientServer } from "@/lib/supabase-server";
import TodayCard from "./today-card";

export default async function Home() {
  const supabase = await createClientServer(); // <-- add await
  const today = new Date().toISOString().slice(0, 10);

  let prompt: any = null;
  let total = 0;

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
  } catch {}

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Today’s Prayer</h1>
      <TodayCard prompt={prompt} initialTotal={total} />
    </div>
  );
}