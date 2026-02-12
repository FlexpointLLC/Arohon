import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

/**
 * POST: Re-run financial completion for a ride (fn_complete_ride_background).
 * Use when the ride status is already "completed" but transaction/invoice/earnings
 * are missing (e.g. stuck ride). The RPC is idempotent.
 * Body (optional): { actual_distance_km?: number, actual_duration_minutes?: number }
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: rideId } = await params;
  const body = await request.json().catch(() => ({}));
  const actualDistanceKm =
    body?.actual_distance_km != null ? Number(body.actual_distance_km) : null;
  const actualDurationMinutes =
    body?.actual_duration_minutes != null
      ? Number(body.actual_duration_minutes)
      : null;

  const { data, error } = await supabaseAdmin.rpc("fn_complete_ride_background", {
    p_ride_id: rideId,
    p_actual_distance_km: actualDistanceKm,
    p_actual_duration_minutes: actualDurationMinutes,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  const result = data as { ok?: boolean; error?: string; note?: string } | null;
  if (result && result.ok === false) {
    return NextResponse.json(
      { ok: false, error: result.error ?? "RPC failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    ok: true,
    note: (result as { note?: string })?.note ?? undefined,
  });
}
