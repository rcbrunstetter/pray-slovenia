import { NextRequest, NextResponse } from "next/server";
import { createClientServer } from "@/lib/supabase-server";

export async function POST(_req: NextRequest) {
  const supabase = await createClientServer();
  await supabase.auth.signOut();
  return NextResponse.redirect(new URL("/admin/login", _req.url));
}
