import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  const { isAdmin, user } = await requireAdmin();
  if (!isAdmin || !user) return NextResponse.json({ ok: false }, { status: 401 });

  const { title, content } = await req.json();
  const { error } = await supabaseAdmin.from("ministry_updates").insert({
    title, content, created_by: user.id
  });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true }, { status: 200 });
}