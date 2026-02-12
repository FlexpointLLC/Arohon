"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SelectNative } from "@/components/ui/select-native";
import { SortableTh } from "@/components/ui/sortable-th";
import { formatDate } from "@/lib/format-date";

const STATUS_OPTIONS = ["pending", "completed", "cancelled"] as const;

type TransactionRow = {
  id: string;
  ride_id: string | null;
  amount: number | null;
  currency: string | null;
  payment_method: string | null;
  status: string;
  payment_received_at: string | null;
  created_at: string;
};

export function TransactionsTable({
  list,
  page,
  pageSize,
  totalCount,
  searchParams,
  sortBy = null,
  sortOrder = "desc",
  basePath = "/dashboard/transactions",
}: {
  list: TransactionRow[];
  page: number;
  pageSize: number;
  totalCount: number;
  searchParams: Record<string, string>;
  sortBy?: string | null;
  sortOrder?: "asc" | "desc";
  basePath?: string;
}) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/transactions/${id}`, {
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
      setUpdatingId(null);
    }
    router.refresh();
  }

  return (
    <table className="table-sleek">
      <thead>
        <tr>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Ride</th>
          {sortBy != null ? (
            <SortableTh label="Amount" sortKey="amount" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} align="right" />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Amount</th>
          )}
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Currency</th>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Method</th>
          {sortBy != null ? (
            <SortableTh label="Status" sortKey="status" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Status</th>
          )}
          {sortBy != null ? (
            <SortableTh label="Received at" sortKey="payment_received_at" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Received at</th>
          )}
          {sortBy != null ? (
            <SortableTh label="Created" sortKey="created_at" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Created</th>
          )}
        </tr>
      </thead>
      <tbody>
        {list.length === 0 ? (
          <tr>
            <td colSpan={7} className="py-12 text-center text-slate-400">
              No transactions found.
            </td>
          </tr>
        ) : (
          list.map((t) => (
            <tr key={t.id}>
              <td>
                {t.ride_id ? (
                  <Link href={`/dashboard/rides/${t.ride_id}`} className="text-[var(--primary)] hover:underline text-xs">
                    {t.ride_id.slice(0, 8)}…
                  </Link>
                ) : "—"}
              </td>
              <td className="text-right font-medium text-white">{Number(t.amount ?? 0).toFixed(2)}</td>
              <td className="text-slate-300">{t.currency ?? "BDT"}</td>
              <td className="capitalize text-slate-300">{t.payment_method ?? "—"}</td>
              <td>
                <SelectNative
                  value={t.status}
                  onChange={(e) => updateStatus(t.id, e.target.value)}
                  disabled={updatingId === t.id}
                  loading={updatingId === t.id}
                  className="min-w-[110px] capitalize"
                  options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
                  variantByValue={{ completed: "success", cancelled: "danger", pending: "warning" }}
                />
              </td>
              <td className="text-slate-400 text-xs">
                {formatDate(t.payment_received_at)}
              </td>
              <td className="text-slate-400 text-xs">{formatDate(t.created_at)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
