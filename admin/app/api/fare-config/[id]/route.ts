import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

/** GET: Fetch single fare_config row */
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
    .from("fare_config")
    .select("*")
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

/** PATCH: Update fare_config row. Body: any subset of columns. */
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

  const allowed = [
    "vehicle_type", "base_fare", "per_km_rate", "per_minute_rate", "minimum_fare",
    "surge_multiplier", "surge_enabled", "discount_percentage", "discount_enabled",
    "discount_max_amount", "round_trip_discount_percentage", "waiting_charge_per_minute",
    "free_waiting_minutes", "cancellation_fee", "free_cancellation_minutes", "is_active",
    "promo_enabled", "promo_code", "promo_percentage", "intercity_base_fare",
    "intercity_per_km_rate", "intercity_per_minute_rate", "intercity_minimum_fare",
    "intercity_surge_multiplier",
  ] as const;

  const update: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
    updated_by: admin.user_id ?? null,
  };

  const bodyObj = body as Record<string, unknown>;
  const numericKeys = new Set(["base_fare", "per_km_rate", "per_minute_rate", "minimum_fare", "surge_multiplier", "discount_percentage", "discount_max_amount", "round_trip_discount_percentage", "waiting_charge_per_minute", "free_waiting_minutes", "cancellation_fee", "free_cancellation_minutes", "promo_percentage", "intercity_base_fare", "intercity_per_km_rate", "intercity_per_minute_rate", "intercity_minimum_fare", "intercity_surge_multiplier"]);
  for (const key of allowed) {
    if (!Object.prototype.hasOwnProperty.call(bodyObj, key)) continue;
    const v = bodyObj[key];
    if (key.endsWith("_enabled")) {
      update[key] = v === true || v === "true";
    } else if (key === "vehicle_type" || key === "promo_code") {
      update[key] = v == null || v === "" ? null : String(v);
    } else if (numericKeys.has(key)) {
      const n = typeof v === "string" ? Number(v) : Number(v);
      update[key] = Number.isNaN(n) ? null : n;
    } else if (key === "is_active") {
      update[key] = v === true || v === "true";
    }
  }

  const { error } = await supabaseAdmin
    .from("fare_config")
    .update(update)
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
