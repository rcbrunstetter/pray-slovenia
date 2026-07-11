import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/admin";

export async function POST(req: NextRequest) {
  const { isAdmin, user } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { day_of_month, title, content, verse } = await req.json();
  if (!day_of_month || !title || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from("recurring_prompts").insert({ day_of_month, title, content, verse: verse || null, created_by: user?.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await supabaseAdmin.from("recurring_prompts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
