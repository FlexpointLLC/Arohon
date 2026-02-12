"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SelectNative } from "@/components/ui/select-native";

const STATUS_OPTIONS = ["open", "in_progress", "resolved", "closed"];

function statusLabel(s: string) {
  return s.replace("_", " ");
}

function StatusBadge({ status }: { status: string }) {
  const className = status === "resolved" || status === "closed" ? "badge-success" : "badge-warning";
  return <span className={className}>{status.replace("_", " ")}</span>;
}

export function TicketHeader({
  ticketId,
  ticketNumber,
  subject,
  status,
  reportId,
}: {
  ticketId: string;
  ticketNumber: string;
  subject: string | null;
  status: string;
  reportId?: string | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function onStatusChange(newStatus: string) {
    setSaving(true);
    const res = await fetch(`/api/support/tickets/${ticketId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setSaving(false);
    if (res.ok) router.refresh();
  }

  return (
    <div className="shrink-0 border-b border-slate-800/80 bg-slate-900/95 px-6 py-4">
      <Link href="/dashboard/support" className="mb-3 inline-block text-sm font-medium text-[var(--primary)] hover:opacity-90">
        ← Back to Support
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight text-white">{ticketNumber}</h1>
          <StatusBadge status={status} />
          <span className="text-slate-400">·</span>
          <p className="text-slate-300">{subject}</p>
          {reportId && (
            <>
              <span className="text-slate-500">·</span>
              <Link
                href={`/dashboard/support/reports/${reportId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--primary)] hover:underline"
              >
                View report
              </Link>
            </>
          )}
        </div>
        <SelectNative
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-72 shrink-0"
          options={STATUS_OPTIONS.map((s) => ({ value: s, label: statusLabel(s) }))}
          variantByValue={{
            open: "warning",
            in_progress: "warning",
            resolved: "success",
            closed: "danger",
          }}
          loading={saving}
          disabled={saving}
        />
      </div>
    </div>
  );
}
