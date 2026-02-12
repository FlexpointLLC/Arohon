import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

/** GET: List notifications (optional ?limit=50&offset=0&user_id=). Returns { data, total }. */
export async function GET(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50", 10) || 50));
  const offset = Math.max(0, parseInt(searchParams.get("offset") ?? "0", 10) || 0);
  const userId = searchParams.get("user_id")?.trim() || null;

  let query = supabaseAdmin
    .from("notifications")
    .select("id, user_id, title, body, notification_type, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (userId) query = query.eq("user_id", userId);

  const { data, error, count } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data: data ?? [], total: count ?? 0 });
}
