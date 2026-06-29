import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function GET(req: NextRequest) {
  // Verify this is called by Vercel cron
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Guard: only send at 8 AM Eastern — whichever cron fires off-hour is a no-op
  const easternHour = parseInt(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", hour12: false }).format(new Date()),
    10
  );
  if (easternHour !== 8) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // Get today's prompt
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  const { data: prompt } = await supabaseAdmin
    .from("prayer_prompts")
    .select("title, content")
    .eq("date", today)
    .maybeSingle();

  let resolvedPrompt = prompt;
  if (!resolvedPrompt) {
    const dayOfMonth = parseInt(today.split("-")[2], 10);
    const { data: recurring } = await supabaseAdmin
      .from("recurring_prompts")
      .select("title, content")
      .eq("day_of_month", dayOfMonth)
      .maybeSingle();
    resolvedPrompt = recurring ?? null;
  }

  const title = "Pray Slovenia 🙏";
  const body = resolvedPrompt ? `Today: ${resolvedPrompt.title}` : "Time to pray for Slovenia today.";

  // Get all active subscriptions
  const { data: subscriptions } = await supabaseAdmin
    .from("push_subscriptions")
    .select("*")
    .eq("active", true);

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  let sent = 0;
  let failed = 0;

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({ title, body, url: "/" })
        );
        sent++;
      } catch (err: any) {
        failed++;
        // If subscription is expired/invalid, deactivate it
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabaseAdmin.from("push_subscriptions").update({ active: false }).eq("endpoint", sub.endpoint);
        }
      }
    })
  );

  return NextResponse.json({ ok: true, sent, failed });
}