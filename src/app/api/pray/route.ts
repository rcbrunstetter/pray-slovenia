// src/app/api/pray/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { todayInLjubljanaISO } from "@/lib/time";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const today = todayInLjubljanaISO();

  // Get or create a device_id cookie so anonymous users can only pray once/day
  const cookieStore = await cookies();
  let deviceId = cookieStore.get("device_id")?.value;
  const isNewDevice = !deviceId;
  if (!deviceId) deviceId = uuidv4();

  // Register device if new
  if (isNewDevice) {
    await supabaseAdmin.from("devices").upsert({ device_id: deviceId });
  }

  // Check if already prayed today
  const { data: existing } = await supabaseAdmin
    .from("prayer_events")
    .select("id")
    .eq("device_id", deviceId)
    .eq("event_date", today)
    .maybeSingle();

  if (existing) {
    const response = NextResponse.json({ ok: true, alreadyPrayed: true });
    response.cookies.set("device_id", deviceId, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  // Record the prayer event (trigger will update daily_totals automatically)
  const { error } = await supabaseAdmin.from("prayer_events").insert({
    event_date: today,
    device_id: deviceId,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true, alreadyPrayed: false });
  response.cookies.set("device_id", deviceId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });
  return response;
}