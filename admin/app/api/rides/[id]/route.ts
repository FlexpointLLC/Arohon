import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

// Must match DB CHECK constraints
const VALID_STATUSES = ["pending", "searching", "queued", "driver_assigned", "driver_arriving", "in_progress", "completed", "cancelled"];
const VALID_PAYMENT_STATUSES = ["pending", "paid", "cancelled"];
const VALID_CANCELLED_BY = ["customer", "rider", "system"];

/** PATCH: Admin update ride (status, payment_status, cancellation). Body: { status?, payment_status?, cancelled_at?, cancellation_reason?, cancelled_by? } */
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

  if (body.hasOwnProperty("status")) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: `Invalid status. Allowed: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }
    update.status = body.status;
  }
  if (body.hasOwnProperty("payment_status")) {
    if (body.payment_status != null && !VALID_PAYMENT_STATUSES.includes(body.payment_status)) {
      return NextResponse.json({ error: `Invalid payment_status. Allowed: ${VALID_PAYMENT_STATUSES.join(", ")}` }, { status: 400 });
    }
    update.payment_status = body.payment_status;
  }
  if (body.hasOwnProperty("cancelled_at")) update.cancelled_at = body.cancelled_at;
  if (body.hasOwnProperty("cancellation_reason")) update.cancellation_reason = body.cancellation_reason;
  if (body.hasOwnProperty("cancelled_by")) {
    if (body.cancelled_by != null && !VALID_CANCELLED_BY.includes(body.cancelled_by)) {
      return NextResponse.json({ error: `Invalid cancelled_by. Allowed: ${VALID_CANCELLED_BY.join(", ")}` }, { status: 400 });
    }
    update.cancelled_by = body.cancelled_by;
  }

  if (Object.keys(update).length <= 1) {
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabaseAdmin
    .from("rides")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
