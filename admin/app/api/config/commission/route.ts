import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * Update rider commission % in system_settings only.
 * Trigger trg_system_settings_commission_sync syncs this to riders.commission_percentage.
 * Do not write to riders.commission_percentage in the admin.
 */
export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const value = Number(body?.value);
  if (Number.isNaN(value) || value < 0 || value > 100) {
    return NextResponse.json(
      { error: "Invalid commission value" },
      { status: 400 }
    );
  }

  // Select by setting_key to get primary key id (UPDATE must use WHERE on id for some Supabase configs)
  const { data: row } = await supabaseAdmin
    .from("system_settings")
    .select("id")
    .eq("setting_key", "rider_commission_percentage")
    .maybeSingle();

  if (row?.id) {
    const { error } = await supabaseAdmin
      .from("system_settings")
      .update({
        setting_value: value,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await supabaseAdmin
      .from("system_settings")
      .insert({
        setting_key: "rider_commission_percentage",
        setting_value: value,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
