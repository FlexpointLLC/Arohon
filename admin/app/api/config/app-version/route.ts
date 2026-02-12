import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

/** POST: Update app_version_control row. Body: { id, min_required_version?, latest_version?, store_url_android?, store_url_ios?, change_log? } */
export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const id = body?.id as string;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const row: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (body.hasOwnProperty("min_required_version")) row.min_required_version = body.min_required_version;
  if (body.hasOwnProperty("latest_version")) row.latest_version = body.latest_version;
  if (body.hasOwnProperty("store_url_android")) row.store_url_android = body.store_url_android;
  if (body.hasOwnProperty("store_url_ios")) row.store_url_ios = body.store_url_ios;
  if (body.hasOwnProperty("change_log")) row.change_log = Array.isArray(body.change_log) ? body.change_log : [];

  const { error } = await supabaseAdmin
    .from("app_version_control")
    .update(row)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
