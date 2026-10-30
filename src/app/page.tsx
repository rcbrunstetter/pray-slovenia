import { createClientServer } from "@/lib/supabase-server";
import TodayScreen from "./today-screen";
import NotificationPrompt from "@/components/NotificationPrompt";

export default async function Home() {
  const supabase = await createClientServer();
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  const dateLabel = new Date().toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
  });

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

    if (!prompt) {
      const dayOfMonth = parseInt(today.split("-")[2], 10);
      const { data: recurring } = await supabase
        .from("recurring_prompts")
        .select("*")
        .eq("day_of_month", dayOfMonth)
        .maybeSingle();
      prompt = recurring ?? null;
    }

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
  } catch (err) {
    console.error("Failed to load home page data:", err);
  }

  return (
    <TodayScreen prompt={prompt} initialTotal={total} dateLabel={dateLabel}>
      <NotificationPrompt />

      <section className="flex flex-col gap-3">
        <h2 className="text-[28px] leading-[1.15] font-medium dark:font-normal">Live Updates</h2>
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
