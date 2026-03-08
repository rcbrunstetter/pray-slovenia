// src/lib/admin.ts
import { createClientServer } from "@/lib/supabase-server";

export type AdminCheck = {
  isAdmin: boolean;
  user: { id: string; email?: string | null } | null;
};

export async function requireAdmin(): Promise<AdminCheck> {
  const supabase = await createClientServer();

  // getUser works server-side with the SSR client
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { isAdmin: false, user: null };
  }

  // Postgres function created in your SQL: is_admin() -> boolean
  const { data, error } = await supabase.rpc("is_admin");

  if (error) {
    // Fail safe: treat as non-admin if RPC fails
    return { isAdmin: false, user: { id: user.id, email: user.email } };
  }

  return { isAdmin: data === true, user: { id: user.id, email: user.email } };
}