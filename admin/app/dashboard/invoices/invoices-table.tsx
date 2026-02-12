"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SelectNative } from "@/components/ui/select-native";
import { SortableTh } from "@/components/ui/sortable-th";
import { TablePagination } from "@/components/ui/table-pagination";
import { formatDate } from "@/lib/format-date";

const STATUS_OPTIONS = ["pending", "paid", "cancelled"] as const;

type InvoiceRow = {
  id: string;
  invoice_number: string | null;
  total_amount: number | null;
  tax_amount: number | null;
  final_amount: number | null;
  payment_method: string | null;
  payment_status: string;
  issued_at: string | null;
};

export function InvoicesTable({
  list,
  page,
  pageSize,
  totalCount,
  searchParams,
  sortBy = null,
  sortOrder = "desc",
  basePath = "/dashboard/invoices",
}: {
  list: InvoiceRow[];
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

  async function updateStatus(id: string, payment_status: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to update payment status: ${data.error ?? res.statusText}`);
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
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Invoice #</th>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Total (৳)</th>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Tax (৳)</th>
          {sortBy != null ? (
            <SortableTh label="Final (৳)" sortKey="final_amount" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} align="right" />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Final (৳)</th>
          )}
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Method</th>
          {sortBy != null ? (
            <SortableTh label="Status" sortKey="payment_status" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Status</th>
          )}
          {sortBy != null ? (
            <SortableTh label="Issued" sortKey="issued_at" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Issued</th>
          )}
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {list.length === 0 ? (
          <tr>
            <td colSpan={8} className="py-12 text-center text-slate-400">
              No invoices found.
            </td>
          </tr>
        ) : (
          list.map((inv) => (
            <tr key={inv.id}>
              <td className="font-medium text-slate-200">{inv.invoice_number ?? "—"}</td>
              <td className="text-right text-slate-300">{Number(inv.total_amount ?? 0).toFixed(2)}</td>
              <td className="text-right text-slate-300">{Number(inv.tax_amount ?? 0).toFixed(2)}</td>
              <td className="text-right font-medium text-white">{Number(inv.final_amount ?? 0).toFixed(2)}</td>
              <td className="capitalize text-slate-300">{inv.payment_method ?? "—"}</td>
              <td>
                <SelectNative
                  value={inv.payment_status ?? "pending"}
                  onChange={(e) => updateStatus(inv.id, e.target.value)}
                  disabled={updatingId === inv.id}
                  loading={updatingId === inv.id}
                  className="min-w-[110px] capitalize"
                  options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
                  variantByValue={{ paid: "success", cancelled: "danger", pending: "warning" }}
                />
              </td>
              <td className="text-slate-400">{formatDate(inv.issued_at)}</td>
              <td className="text-right">
                <Link href={`/dashboard/invoices/${inv.id}`} className="text-sm font-medium text-[var(--primary)] hover:underline">
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
