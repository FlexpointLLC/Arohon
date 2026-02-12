"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SupportReplyForm({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSaving(true);
    const res = await fetch(`/api/support/tickets/${ticketId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: body.trim() }),
    });
    setSaving(false);
    if (res.ok) {
      setBody("");
      router.refresh();
    }
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Type your reply..."
          rows={4}
          required
          className="min-h-[96px] w-full flex-1 resize-none rounded-xl border border-slate-600 bg-slate-800/80 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/30"
        />
        <Button type="submit" disabled={saving || !body.trim()} className="shrink-0 sm:self-end">
          {saving ? "Sending…" : "Send"}
        </Button>
      </div>
    </form>
  );
}
