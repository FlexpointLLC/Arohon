import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

const ALLOWED_STATUSES = ["pending", "completed", "cancelled"] as const;

/** PATCH: Update transaction status. Body: { status: "pending" | "completed" | "cancelled" } */
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

  const { error } = await supabaseAdmin
    .from("transactions")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
