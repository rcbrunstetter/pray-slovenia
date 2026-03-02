import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const { isAdmin } = await requireAdmin();
  if (!isAdmin) return NextResponse.json({ ok: false }, { status: 401 });

  const id = Number(params.id);
  const { error } = await supabaseAdmin.from("ministry_updates").delete().eq("id", id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true }, { status: 200 });
}