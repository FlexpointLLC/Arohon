import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

/** PATCH: Mark a rider weekly payment as paid (or update status). */
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

  const allowed = [
    "payment_status",
    "paid_at",
    "paid_amount",
    "bkash_reference",
    "bkash_phone_number",
    "notes",
  ] as const;

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  const bodyObj = body as Record<string, unknown>;
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(bodyObj, key)) {
      update[key] = bodyObj[key];
    }
  }

  // If marking as paid, set verified_by and verified_at
  if (bodyObj.payment_status === "paid") {
    update.verified_by = admin.user_id ?? null;
    update.verified_at = new Date().toISOString();
    if (!bodyObj.paid_at) {
      update.paid_at = new Date().toISOString();
    }
  }

  const { error } = await supabaseAdmin
    .from("rider_weekly_payments")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
