import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createClientServer } from "@/lib/supabase-server";

async function checkAdmin() {
  const supabase = await createClientServer();
  const { data, error } = await supabase.rpc("is_admin");
  return !error && data === true;
}

export async function POST(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { day_of_month, title, content, verse, user_id } = await req.json();
  const { error } = await supabaseAdmin.from("recurring_prompts").insert({ day_of_month, title, content, verse: verse || null, created_by: user_id });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from("recurring_prompts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}