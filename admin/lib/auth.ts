import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAdmin } from "./supabase/server";

export type AdminUser = {
  id: string;
  user_id: string;
  role: string;
  is_active: boolean;
  user?: { id: string; email?: string; full_name?: string; phone?: string };
};

/**
 * Get Supabase auth session from cookies (server).
 * Returns null session when Supabase env vars are missing or on any error.
 */
export async function getSession() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (!url || !anonKey) {
      return { session: null, supabase: null };
    }
    const cookieStore = await cookies();
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return { session, supabase };
  } catch {
    return { session: null, supabase: null };
  }
}

/**
 * Check if current user is an active admin (admin_users row + users.user_type or user_roles).
 * Uses service role to read admin_users and users.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const { session } = await getSession();
  if (!session?.user?.id) return null;

  const { data: adminRow } = await supabaseAdmin
    .from("admin_users")
    .select(
      `
      id,
      user_id,
      role,
      is_active,
      users ( id, email, full_name, phone )
    `
    )
    .eq("user_id", session.user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!adminRow) return null;

  const user = (adminRow as any).users;
  return {
    id: adminRow.id,
    user_id: adminRow.user_id,
    role: adminRow.role,
    is_active: adminRow.is_active,
    user: user
      ? {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
        }
      : undefined,
  };
}
