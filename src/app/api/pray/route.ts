import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { todayInLjubljanaISO } from "@/lib/time";

export async function POST(request: NextRequest) {
  try {
    let deviceId = request.cookies.get("device_id")?.value;
    if (!deviceId) {
      deviceId = crypto.randomUUID();
    }

    const today = todayInLjubljanaISO();

    // Ensure device exists
    const { error: deviceErr } = await supabaseAdmin
      .from("devices")
      .upsert({ device_id: deviceId }, { onConflict: "device_id" });
    if (deviceErr) {
      return NextResponse.json({ ok: false, error: deviceErr.message }, { status: 400 });
    }

    // Try a plain INSERT to detect duplicates via unique constraint
    const { error: insertErr } = await supabaseAdmin
      .from("prayer_events")
      .insert({ event_date: today, device_id: deviceId });

    let body: any = { ok: true, date: today, alreadyPrayed: false };
    let status = 200;

    if (insertErr) {
      // 23505 = unique_violation (already clicked today on this device)
      if ((insertErr as any).code === "23505") {
        body = { ok: true, date: today, alreadyPrayed: true };
      } else {
        body = { ok: false, error: insertErr.message };
        status = 400;
      }
    }

    const isProd = process.env.NODE_ENV === "production";
    const res = NextResponse.json(body, { status });

    // Important: secure=false for localhost (dev), secure=true in prod (HTTPS)
    res.cookies.set({
      name: "device_id",
      value: deviceId,
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,     // <-- THIS FIXES SAFARI/LOCALHOST
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return res;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}