import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

/** GET: Fetch a single notification (super admin) */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("notifications")
    .select("id, user_id, title, body, notification_type, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message ?? "Not found" },
      { status: error?.code === "PGRST116" ? 404 : 500 }
    );
  }
  return NextResponse.json(data);
}

/** PATCH: Update a notification (super admin). Body: { title?, body?, notification_type?, user_id? } */
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
  if (body.hasOwnProperty("title")) update.title = body.title == null ? null : String(body.title).trim();
  if (body.hasOwnProperty("body")) update.body = body.body == null ? null : String(body.body).trim();
  if (body.hasOwnProperty("notification_type")) update.notification_type = body.notification_type;
  if (body.hasOwnProperty("user_id")) update.user_id = body.user_id?.trim() || null;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: true });
  }

  const { error } = await supabaseAdmin
    .from("notifications")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

/** DELETE: Delete a notification (super admin) */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const { error } = await supabaseAdmin
    .from("notifications")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
