import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const userId = (body?.user_id as string)?.trim() || null;
  const title = (body?.title as string)?.trim();
  const bodyText = (body?.body as string)?.trim();
  const notificationType = (body?.notification_type as string) || "general";

  if (!title || !bodyText) {
    return NextResponse.json(
      { error: "Title and body required" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin.from("notifications").insert({
    user_id: userId,
    notification_type: notificationType,
    title,
    body: bodyText,
    data: {},
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
