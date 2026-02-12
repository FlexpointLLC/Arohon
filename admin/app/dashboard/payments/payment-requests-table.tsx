"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectNative } from "@/components/ui/select-native";
import { SortableTh } from "@/components/ui/sortable-th";
import { formatDateTime } from "@/lib/format-date";

const STATUS_OPTIONS = ["pending", "approved", "rejected"] as const;

type Row = {
  id: string;
  rider_id: string;
  amount: number;
  status: string;
  rider_phone_number: string | null;
  notes: string | null;
  created_at: string;
  riders: { users: { full_name: string | null; phone: string | null } | null } | null;
};

type SortableProps = { sortBy: string | null; sortOrder: "asc" | "desc"; basePath: string; searchParams: Record<string, string> };

export function PaymentRequestsTable({
  list,
  statusFilter = "pending",
  sortBy = null,
  sortOrder = "desc",
  basePath = "/dashboard/payments",
  searchParams = {},
}: {
  list: Row[];
  statusFilter?: string;
} & Partial<SortableProps>) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);
  const [displayList, setDisplayList] = useState<Row[]>(list);

  useEffect(() => {
    setDisplayList(list);
  }, [list]);

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/payment-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to update status: ${data.error ?? res.statusText}`);
        return;
      }
      if (status === "approved") {
        setDisplayList((prev) => prev.filter((r) => r.id !== id));
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
              <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Rider</th>
              {sortBy != null ? (
                <SortableTh label="Amount" sortKey="amount" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} />
              ) : (
                <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Amount</th>
              )}
              <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Notes</th>
              {sortBy != null ? (
                <SortableTh label="Date" sortKey="created_at" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} align="right" />
              ) : (
                <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Date</th>
              )}
              {sortBy != null ? (
                <SortableTh label="Status" sortKey="status" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} />
              ) : (
                <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Status</th>
              )}
              <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayList.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  No requests{statusFilter && statusFilter !== "all" ? ` with status "${statusFilter}"` : ""}.
                </td>
              </tr>
            ) : (
              displayList.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.riders?.users?.full_name ?? "—"} (
                    {r.riders?.users?.phone ?? r.rider_phone_number ?? "—"})
                  </td>
                  <td className="font-medium text-slate-200">৳{Number(r.amount).toFixed(2)}</td>
                  <td className="text-slate-300">{r.notes ?? "—"}</td>
                  <td className="text-right text-slate-400">
                    {formatDateTime(r.created_at)}
                  </td>
                  <td>
                    <SelectNative
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      disabled={updating === r.id}
                      loading={updating === r.id}
                      className="min-w-[110px] capitalize"
                      options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
                      variantByValue={{ pending: "warning", approved: "success", rejected: "danger" }}
                    />
                  </td>
                  <td className="text-right">
                    {r.status === "pending" ? (
                      <Button
                        size="sm"
                        onClick={() => updateStatus(r.id, "approved")}
                        disabled={updating === r.id}
                      >
                        {updating === r.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Mark as paid"
                        )}
                      </Button>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
  );
}
