// src/lib/supabase-server.ts
import 'server-only';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-only Supabase client for Server Components / loaders.
 * Next 15+ returns a Promise from cookies(), so we await it here.
 * We provide no-op set/remove in Server Component contexts — writing cookies
 * is handled in Route Handlers (e.g., /api/pray) via NextResponse.
 */
export const createClientServer = async () => {
  const cookieStore = await cookies(); // <-- await the Promise<ReadonlyRequestCookies>

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read works in Server Components
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // These are intentionally no-ops here. Use NextResponse in Route Handlers to write.
        set(_name: string, _value: string, _options: CookieOptions) {
          /* no-op in Server Components */
        },
        remove(_name: string, _options: CookieOptions) {
          /* no-op in Server Components */
        },
      },
    }
  );
};