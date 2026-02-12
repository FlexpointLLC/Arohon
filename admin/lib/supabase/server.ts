import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Server-only Supabase client with service role (bypasses RLS).
 * Use only in Server Components, API routes, Server Actions.
 * Never expose this client or the key to the browser.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
  global: {
    fetch: (url: RequestInfo | URL, options?: RequestInit) =>
      fetch(url, { ...options, cache: "no-store" }),
  },
});
