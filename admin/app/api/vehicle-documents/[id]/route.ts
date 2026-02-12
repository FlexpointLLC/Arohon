import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

const VALID_STATUS = ["pending", "approved", "rejected"];

/** PATCH: Update vehicle_document verification_status and/or expiry_date. */
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

  const update: Record<string, unknown> = {};

  if (body.hasOwnProperty("verification_status")) {
    const status = body.verification_status;
    if (typeof status !== "string" || !VALID_STATUS.includes(status)) {
      return NextResponse.json(
        { error: `Invalid verification_status. Allowed: ${VALID_STATUS.join(", ")}` },
        { status: 400 }
      );
    }
    update.verification_status = status;
  }

  if (body.hasOwnProperty("expiry_date")) {
    const v = body.expiry_date;
    if (v !== null && v !== undefined && v !== "") {
      const date = new Date(v);
      if (Number.isNaN(date.getTime())) {
        return NextResponse.json({ error: "Invalid expiry_date" }, { status: 400 });
      }
      update.expiry_date = date.toISOString().slice(0, 10);
    } else {
      update.expiry_date = null;
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabaseAdmin
    .from("vehicle_documents")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
