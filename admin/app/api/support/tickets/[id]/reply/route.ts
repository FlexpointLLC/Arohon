import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

/** POST: Add support reply and optionally update ticket status. Body: { body, status? } */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id: ticketId } = await params;
  const body = await request.json().catch(() => ({}));
  const messageBody = (body?.body as string)?.trim();
  const status = (body?.status as string)?.trim();

  if (!messageBody) {
    return NextResponse.json(
      { error: "Missing message body" },
      { status: 400 }
    );
  }

  const { error: msgError } = await supabaseAdmin
    .from("support_ticket_messages")
    .insert({
      ticket_id: ticketId,
      sender_type: "support",
      body: messageBody,
    });

  if (msgError) {
    return NextResponse.json(
      { error: msgError.message },
      { status: 500 }
    );
  }

  if (status && ["open", "in_progress", "resolved", "closed"].includes(status)) {
    await supabaseAdmin
      .from("support_tickets")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", ticketId);
  }

  return NextResponse.json({ ok: true });
}
