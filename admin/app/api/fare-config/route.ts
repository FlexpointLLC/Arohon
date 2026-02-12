import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

/** GET: List all fare_config rows */
export async function GET() {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await supabaseAdmin
    .from("fare_config")
    .select("*")
    .order("vehicle_type");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}
