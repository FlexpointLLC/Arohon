import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const requestId = body?.requestId as string;
  if (!requestId) {
    return NextResponse.json(
      { error: "Missing requestId" },
      { status: 400 }
    );
  }

  const { data: pr } = await supabaseAdmin
    .from("payment_requests")
    .select("id, rider_id, amount, status")
    .eq("id", requestId)
    .single();

  if (!pr || pr.status !== "pending") {
    return NextResponse.json(
      { error: "Request not found or already processed" },
      { status: 400 }
    );
  }

  await supabaseAdmin
    .from("payment_requests")
    .update({
      status: "approved",
      reviewed_by: admin.user_id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  // Mark rider's pending/overdue weekly payments as paid so trigger recalculates riders.unpaid_amount and riders.is_blocked.
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

  return NextResponse.json({ ok: true });
}
