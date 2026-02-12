import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client (anon key). Used for auth (login/session).
 * RLS applies; admin checks are done server-side after validating session.
 */
export function createClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase env: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_URL and SUPABASE_ANON_KEY)"
    );
  }
  return createBrowserClient(url, anonKey);
}
