import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * PATCH: Update rider admin-editable fields.
 *
 * Allowed: is_active, is_blocked, is_online, verification_status, verification_reason, account_suspension_reason.
 * DO NOT add other trigger-maintained columns (payment_tier, unpaid_amount, total_earnings,
 * total_completed_trips, commission_percentage, etc.) — those are maintained by DB triggers.
 */
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

  // Must match DB CHECK constraint: riders_verification_status_check
  const VALID_VERIFICATION = ["pending", "approved", "rejected", "suspended"];

  const allowed = [
    "is_active",
    "is_blocked",
    "is_online",
    "verification_status",
    "verification_reason",
    "account_suspension_reason",
  ] as const;
  const update: Record<string, unknown> = {};
  const bodyObj = body as Record<string, unknown>;
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(bodyObj, key)) {
      if (key === "is_active" || key === "is_blocked" || key === "is_online") {
        update[key] = !!bodyObj[key];
      } else if (key === "verification_status") {
        if (!VALID_VERIFICATION.includes(bodyObj[key] as string)) {
          return NextResponse.json({ error: `Invalid verification_status. Allowed: ${VALID_VERIFICATION.join(", ")}` }, { status: 400 });
        }
        update[key] = bodyObj[key];
      } else {
        update[key] = bodyObj[key];
      }
    }
  }

  const { error } = await supabaseAdmin
    .from("riders")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
