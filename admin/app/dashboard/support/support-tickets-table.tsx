"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SelectNative } from "@/components/ui/select-native";
import { SortableTh } from "@/components/ui/sortable-th";
import { formatDateTime } from "@/lib/format-date";

const TICKET_STATUSES = ["open", "in_progress", "resolved", "closed"];

type Ticket = {
  id: string;
  ticket_number: string;
  subject: string | null;
  status: string;
  user_id: string | null;
  ride_id: string | null;
  created_at: string;
};

type SortableProps = { sortBy: string | null; sortOrder: "asc" | "desc"; basePath: string; searchParams: Record<string, string> };

export function SupportTicketsTable({
  tickets,
  sortBy = null,
  sortOrder = "desc",
  basePath = "/dashboard/support",
  searchParams = {},
}: { tickets: Ticket[] } & Partial<SortableProps>) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/support/tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to update status: ${data.error ?? res.statusText}`);
        return;
      }
    } catch (err) {
      alert(`Network error: ${err instanceof Error ? err.message : "Unknown error"}`);
      return;
    } finally {
      setUpdating(null);
    }
    router.refresh();
  }

  return (
    <table className="table-sleek">
      <thead>
        <tr>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Ticket #</th>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Subject</th>
          {sortBy != null ? (
            <SortableTh label="Status" sortKey="status" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Status</th>
          )}
          {sortBy != null ? (
            <SortableTh label="Created" sortKey="created_at" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} align="right" />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Created</th>
          )}
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        {tickets.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-12 text-center text-slate-400">No open or in-progress tickets</td>
          </tr>
        ) : (
          tickets.map((t) => (
            <tr key={t.id}>
              <td className="font-mono text-xs text-slate-200">{t.ticket_number}</td>
              <td className="text-slate-200">{t.subject ?? "—"}</td>
              <td>
                <SelectNative
                  value={t.status}
                  onChange={(e) => updateStatus(t.id, e.target.value)}
                  disabled={updating === t.id}
                  loading={updating === t.id}
                  className="min-w-[120px] capitalize"
                  options={TICKET_STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }))}
                  variantByValue={{
                    open: "warning",
                    in_progress: "warning",
                    resolved: "success",
                    closed: "success",
                  }}
                />
              </td>
              <td className="text-right text-slate-400">{formatDateTime(t.created_at)}</td>
              <td className="text-right">
                <Link href={`/dashboard/support/${t.id}`} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
