import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const value = (body?.value as string) ?? "";

  await supabaseAdmin
    .from("system_settings")
    .upsert(
      {
        setting_key: "support_phone",
        support_phone: value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "setting_key" }
    );

  return NextResponse.json({ ok: true });
}
