import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const riderId = body?.riderId as string;
  const status = body?.status as string;
  const reason = (body?.reason as string)?.trim();

  if (!riderId || !status) {
    return NextResponse.json(
      { error: "Missing riderId or status" },
      { status: 400 }
    );
  }
  if (!["approved", "rejected", "suspended"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status" },
      { status: 400 }
    );
  }
  if (status === "rejected" && !reason) {
    return NextResponse.json(
      { error: "Rejection reason required" },
      { status: 400 }
    );
  }

  const update: Record<string, unknown> = {
    verification_status: status,
    updated_at: new Date().toISOString(),
  };
  if (status === "approved") {
    update.is_verified = true;
    update.verification_reason = null;
  }
  if (status === "rejected" || status === "suspended") {
    update.verification_reason = reason ?? null;
  }

  const { error } = await supabaseAdmin
    .from("riders")
    .update(update)
    .eq("id", riderId);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
