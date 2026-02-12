import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

const ALLOWED_STATUSES = ["pending", "approved", "rejected"] as const;

/** PATCH: Update payment request (status). Body: { status?: "pending" | "approved" | "rejected" } */
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
  const status = body?.status as string;

  if (!status || !ALLOWED_STATUSES.includes(status as typeof ALLOWED_STATUSES[number])) {
    return NextResponse.json({ error: "Missing or invalid status" }, { status: 400 });
  }

  const update: Record<string, unknown> = { status };
  if (status === "approved" || status === "rejected") {
    update.reviewed_by = admin.user_id;
    update.reviewed_at = new Date().toISOString();
  }

  const { data: pr, error: updateError } = await supabaseAdmin
    .from("payment_requests")
    .update(update)
    .eq("id", id)
    .select("rider_id")
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // When approving: mark rider's pending/overdue weekly payments as paid so the trigger recalculates unpaid_amount and is_blocked.
  if (status === "approved" && pr?.rider_id) {
    const now = new Date().toISOString();
    await supabaseAdmin
      .from("rider_weekly_payments")
      .update({
        payment_status: "paid",
        paid_at: now,
        verified_by: admin.user_id ?? null,
        verified_at: now,
        updated_at: now,
      })
      .eq("rider_id", pr.rider_id)
      .in("payment_status", ["pending", "overdue"]);
  }

  return NextResponse.json({ ok: true });
}
