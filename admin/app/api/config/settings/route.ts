import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

/** GET: List all system_settings */
export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await supabaseAdmin
    .from("system_settings")
    .select("*")
    .order("setting_key");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

/** POST: Create or update a system setting (body: { setting_key, setting_value?, support_phone?, description? }) */
export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const setting_key = (body?.setting_key as string)?.trim();
  if (!setting_key) {
    return NextResponse.json(
      { error: "Missing setting_key" },
      { status: 400 }
    );
  }
  const row: Record<string, unknown> = {
    setting_key,
    updated_at: new Date().toISOString(),
  };
  if (body.hasOwnProperty("setting_value")) row.setting_value = body.setting_value;
  if (body.hasOwnProperty("support_phone")) row.support_phone = body.support_phone;
  if (body.hasOwnProperty("description")) row.description = body.description;

  const { error } = await supabaseAdmin
    .from("system_settings")
    .upsert(row, { onConflict: "setting_key" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
