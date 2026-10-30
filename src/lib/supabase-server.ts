import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClientServer = async () => {
  const cookieStore = await cookies(); // Next 15 returns Promise

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Components can't set cookies; proxy.ts keeps the session fresh instead.
          }
        },
      },
    }
  );
};
