import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

const VALID_STATUS = ["pending", "approved", "rejected"];

/** PATCH: Update rider_document verification_status. */
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
  const status = body.verification_status;

  if (typeof status !== "string" || !VALID_STATUS.includes(status)) {
    return NextResponse.json(
      { error: `Invalid verification_status. Allowed: ${VALID_STATUS.join(", ")}` },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("rider_documents")
    .update({ verification_status: status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
