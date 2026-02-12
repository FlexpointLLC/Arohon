import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format-date";
import { TicketHeader } from "./ticket-header";
import { SupportReplyForm } from "./reply-form";

export default async function SupportTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: ticket } = await supabaseAdmin
    .from("support_tickets")
    .select("*, support_ticket_messages(*)")
    .eq("id", id)
    .single();

  if (!ticket) notFound();

  const messages = (ticket as any).support_ticket_messages ?? [];

  return (
    <div className="flex h-full min-h-screen flex-col bg-slate-900">
      <TicketHeader
        ticketId={ticket.id}
        ticketNumber={ticket.ticket_number}
        subject={ticket.subject}
        status={ticket.status}
        reportId={(ticket as any).report_id}
      />

      {/* Scrollable conversation — 24px margin from both sides */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        <div className="w-full space-y-3">
          {messages.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">No messages yet. Send a reply below.</p>
          ) : (
            messages.map((m: any) => {
              const isSupport = m.sender_type === "support";
              return (
                <div
                  key={m.id}
                  className={`flex w-full ${isSupport ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      isSupport
                        ? "rounded-br-md bg-slate-800 border border-slate-600/60 text-slate-100"
                        : "rounded-bl-md bg-slate-700/70 text-slate-100"
                    }`}
                  >
                    <p className="text-xs font-medium text-slate-400">{isSupport ? "Support" : "Customer"}</p>
                    <p className="mt-0.5 whitespace-pre-wrap text-sm">{m.body}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDateTime(m.created_at)}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Sticky reply box at bottom */}
      <div className="shrink-0 border-t border-slate-800 bg-slate-800/80 px-6 py-4">
        <SupportReplyForm ticketId={ticket.id} />
      </div>
    </div>
  );
}
