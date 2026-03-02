import { createClientServer } from "@/lib/supabase-server";

export async function requireAdmin() {
  const supabase = await createClientServer();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { isAdmin: false, user: null };

  // Ask Postgres if this email is an admin
  const { data, error } = await supabase.rpc("is_admin"); // returns boolean
  if (error) return { isAdmin: false, user }; // be safe on error

}