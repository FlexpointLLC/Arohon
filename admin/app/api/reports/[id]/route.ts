import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

/** PATCH: Update report status, admin_notes, resolved_by. */
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
    const allowed = ["open", "in_progress", "resolved", "closed"];
    if (!allowed.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = body.status;

    if (body.status === "resolved" || body.status === "closed") {
      update.resolved_by = admin.user_id ?? null;
      update.resolved_at = new Date().toISOString();
    }
  }

  if (body.hasOwnProperty("admin_notes")) {
    update.admin_notes = body.admin_notes;
  }

  const { error } = await supabaseAdmin
    .from("reports")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
