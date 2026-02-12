import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * After sign-up, create public.users and admin_users so the user can access the panel.
 * Accepts accessToken from the client (session cookie is not set yet right after signUp).
 * Allowed if: (1) no admins exist yet (first user), OR (2) valid ADMIN_INVITE_CODE is sent.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const accessToken = (body?.accessToken as string)?.trim();
  const inviteCode = (body?.inviteCode as string)?.trim();
  const requiredCode = process.env.ADMIN_INVITE_CODE ?? process.env.NEXT_PUBLIC_ADMIN_INVITE_CODE ?? "";

  let userId: string;
  let email: string | null = null;
  let fullName: string | null = null;

  if (accessToken) {
    const secret = process.env.SUPABASE_JWT_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Server misconfiguration: JWT secret not set." },
        { status: 500 }
      );
    }
    try {
      const { payload } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(secret)
      );
      const sub = payload.sub;
      if (!sub) {
        return NextResponse.json(
          { error: "Invalid token." },
          { status: 401 }
        );
      }
      userId = sub;
      email = (payload.email as string) ?? null;
      const meta = payload as { user_metadata?: { full_name?: string } };
      fullName = (meta.user_metadata?.full_name as string) ?? null;
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 401 }
      );
    }
  } else {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!,
      {
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
      }
    );
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated. Sign up first." },
        { status: 401 }
      );
    }
    userId = session.user.id;
    email = session.user.email ?? null;
    fullName = (session.user.user_metadata?.full_name as string) ?? null;
  }

  const { count } = await supabaseAdmin
    .from("admin_users")
    .select("id", { count: "exact", head: true });

  const isFirstAdmin = (count ?? 0) === 0;
  const hasValidCode = requiredCode && inviteCode === requiredCode;

  if (!isFirstAdmin && !hasValidCode) {
    return NextResponse.json(
      { error: "Invalid invite code or admin sign-up is closed." },
      { status: 403 }
    );
  }

  const { error: userError } = await supabaseAdmin.from("users").upsert(
    {
      id: userId,
      email,
      full_name: fullName,
      user_type: "admin",
      is_verified: true,
      is_active: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  if (userError) {
    return NextResponse.json(
      { error: userError.message },
      { status: 500 }
    );
  }

  const { error: adminError } = await supabaseAdmin.from("admin_users").upsert(
    {
      user_id: userId,
      role: "admin",
      is_active: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (adminError) {
    return NextResponse.json(
      { error: adminError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
