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
  const reason = (body?.reason as string)?.trim();
  if (!requestId || !reason) {
    return NextResponse.json(
      { error: "Missing requestId or reason" },
      { status: 400 }
    );
  }

  const { data: pr } = await supabaseAdmin
    .from("payment_requests")
    .select("id, status")
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
      status: "rejected",
      rejection_reason: reason,
      reviewed_by: admin.user_id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  return NextResponse.json({ ok: true });
}
