import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

const ALLOWED_STATUSES = ["pending", "paid", "cancelled"] as const;

/** PATCH: Update invoice payment_status. Body: { payment_status } */
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
  const payment_status = body?.payment_status as string;

  if (!payment_status || !ALLOWED_STATUSES.includes(payment_status as (typeof ALLOWED_STATUSES)[number])) {
    return NextResponse.json({ error: "Missing or invalid payment_status" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("invoices")
    .update({ payment_status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
