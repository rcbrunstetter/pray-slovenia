import { cookies } from "next/headers";
import TodayScreen from "./today-screen";
import NotificationPrompt from "@/components/NotificationPrompt";
import { SectionTitle } from "@/components/ui";
import type { PrayerRequest, Prompt } from "@/lib/prompts";
import { createClientServer } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { formatDate, todayISO } from "@/lib/time";

export default async function Home() {
  const supabase = await createClientServer();
  const today = todayISO();
  const dayOfMonth = parseInt(today.split("-")[2], 10);
  const deviceId = (await cookies()).get("device_id")?.value;

  let prompt: Prompt | null = null;
  let total = 0;
  let prayerRequests: PrayerRequest[] = [];
  let hasPrayed = false;

  try {
    const [{ data: manual }, { data: recurring }, { data: totalRow }, { data: requests }, { data: prayed }] = await Promise.all([
      supabase.from("prayer_prompts").select("*").eq("date", today).maybeSingle(),
      supabase.from("recurring_prompts").select("*").eq("day_of_month", dayOfMonth).limit(1).maybeSingle(),
      supabase.from("daily_totals").select("*").eq("date", today).maybeSingle(),
      supabase.from("prayer_requests").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(10),
      deviceId
        ? supabaseAdmin.from("prayer_events").select("id").eq("device_id", deviceId).eq("event_date", today).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);
    prompt = manual ?? recurring ?? null;
    total = totalRow?.total ?? 0;
    prayerRequests = requests ?? [];
    hasPrayed = !!prayed;
  } catch (err) {
    console.error("Failed to load home page data:", err);
  }

  return (
    <TodayScreen
      key={today}
      date={today}
      dateLabel={formatDate(today, { weekday: "long", month: "long", day: "numeric" })}
      prompt={prompt}
      initialTotal={total}
      initialHasPrayed={hasPrayed}
    >
      <NotificationPrompt />

      <section className="flex flex-col gap-3">
        <SectionTitle>Live Updates</SectionTitle>
        {prayerRequests.length > 0 ? (
          prayerRequests.map((req) => (
            <div
              key={req.id}
              className={`flex flex-col gap-1.5 rounded-[14px] border bg-card p-[18px] ${req.is_urgent ? "border-urgent" : "border-card-line"}`}
            >
              <div className="font-sans text-[13px] font-medium text-meta">
                {req.is_urgent && <span className="font-semibold text-urgent">Urgent · </span>}
                {new Date(req.created_at).toLocaleDateString("en-US", { timeZone: "America/New_York", month: "long", day: "numeric" })}
              </div>
              <div className="text-[22px] leading-[1.22] font-medium dark:font-normal">{req.title}</div>
              <div className="text-[19px] leading-[1.48] whitespace-pre-line text-update">{req.content}</div>
            </div>
          ))
        ) : (
          <p className="text-[19px] leading-[1.48] text-ink-soft italic">No active prayer requests right now.</p>
        )}
      </section>
    </TodayScreen>
  );
}
