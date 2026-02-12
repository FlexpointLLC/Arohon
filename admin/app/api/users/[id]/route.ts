import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

/** PATCH: Update user (full_name, phone, is_verified). Body: { full_name?, phone?, is_verified? } */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (body.hasOwnProperty("full_name")) update.full_name = body.full_name ?? null;
  if (body.hasOwnProperty("phone")) update.phone = body.phone ?? null;
  if (body.hasOwnProperty("is_verified")) update.is_verified = !!body.is_verified;

  if (Object.keys(update).length <= 1) {
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabaseAdmin
    .from("users")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
