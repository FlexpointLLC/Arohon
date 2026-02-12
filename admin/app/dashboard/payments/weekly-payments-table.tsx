"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SortableTh } from "@/components/ui/sortable-th";
import { formatDate } from "@/lib/format-date";

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "paid"
      ? "badge-success"
      : status === "overdue"
        ? "badge-danger"
        : status === "deactivated"
          ? "badge-danger"
          : "badge-warning";
  return <span className={cls}>{status}</span>;
}

interface WeeklyRow {
  id: string;
  rider_id: string;
  week_start_date: string;
  week_end_date: string;
  total_rides: number;
  total_fare_collected: number;
  commission_percentage: number;
  commission_amount: number;
  net_earnings: number;
  payment_status: string;
  paid_at: string | null;
  paid_amount: number | null;
  bkash_reference: string | null;
  bkash_phone_number: string | null;
  riders: { user_id: string; users: { full_name: string | null; phone: string | null } };
}

type SortableProps = { sortBy: string | null; sortOrder: "asc" | "desc"; basePath: string; searchParams: Record<string, string> };

export function WeeklyPaymentsTable({
  rows,
  sortBy = null,
  sortOrder = "desc",
  basePath = "/dashboard/payments",
  searchParams = {},
}: { rows: WeeklyRow[] } & Partial<SortableProps>) {
  const router = useRouter();
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paidAmount, setPaidAmount] = useState("");
  const [bkashRef, setBkashRef] = useState("");
  const [bkashPhone, setBkashPhone] = useState("");
  const [saving, setSaving] = useState(false);

  async function markAsPaid(id: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/rider-weekly-payments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_status: "paid",
          paid_amount: paidAmount ? Number(paidAmount) : null,
          bkash_reference: bkashRef || null,
          bkash_phone_number: bkashPhone || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to mark as paid: ${data.error ?? res.statusText}`);
        return;
      }
    } catch (err) {
      alert(`Network error: ${err instanceof Error ? err.message : "Unknown error"}`);
      return;
    } finally {
      setSaving(false);
    }
    setPayingId(null);
    setPaidAmount("");
    setBkashRef("");
    setBkashPhone("");
    router.refresh();
  }

  return (
    <table className="table-sleek">
      <thead>
        <tr>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Rider</th>
          {sortBy != null ? (
            <SortableTh label="Week" sortKey="week_start_date" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} sortByParam="wsortBy" sortOrderParam="wsortOrder" />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Week</th>
          )}
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Rides</th>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Fare (৳)</th>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Comm %</th>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Comm (৳)</th>
          {sortBy != null ? (
            <SortableTh label="Net (৳)" sortKey="net_earnings" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} align="right" sortByParam="wsortBy" sortOrderParam="wsortOrder" />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Net (৳)</th>
          )}
          {sortBy != null ? (
            <SortableTh label="Status" sortKey="payment_status" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} sortByParam="wsortBy" sortOrderParam="wsortOrder" />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Status</th>
          )}
          {sortBy != null ? (
            <SortableTh label="Paid at" sortKey="paid_at" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} sortByParam="wsortBy" sortOrderParam="wsortOrder" />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Paid at</th>
          )}
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">bKash ref</th>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={11} className="py-12 text-center text-slate-400">
              No weekly payment records found.
            </td>
          </tr>
        ) : (
          rows.map((r) => {
            const rider = r.riders?.users;
            const isPaying = payingId === r.id;
            return (
              <tr key={r.id}>
                <td className="text-slate-200">
                  <Link href={`/dashboard/users/${r.rider_id}`} className="text-[var(--primary)] hover:underline">
                    {rider?.full_name ?? rider?.phone ?? "—"}
                  </Link>
                </td>
                <td className="text-slate-300 whitespace-nowrap">
                  {r.week_start_date} – {r.week_end_date}
                </td>
                <td className="text-right text-slate-300">{r.total_rides ?? 0}</td>
                <td className="text-right text-slate-300">{Number(r.total_fare_collected ?? 0).toFixed(2)}</td>
                <td className="text-right text-slate-300">{Number(r.commission_percentage ?? 0).toFixed(1)}%</td>
                <td className="text-right text-slate-300">{Number(r.commission_amount ?? 0).toFixed(2)}</td>
                <td className="text-right font-medium text-white">{Number(r.net_earnings ?? 0).toFixed(2)}</td>
                <td><StatusBadge status={r.payment_status} /></td>
                <td className="text-slate-400 text-xs">{formatDate(r.paid_at)}</td>
                <td className="text-slate-400 text-xs">{r.bkash_reference ?? "—"}</td>
                <td className="text-right">
                  {(r.payment_status === "pending" || r.payment_status === "overdue") && !isPaying && (
                    <Button size="sm" onClick={() => setPayingId(r.id)}>
                      Mark paid
                    </Button>
                  )}
                  {isPaying && (
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Amount"
                        className="w-20"
                        value={paidAmount}
                        onChange={(e) => setPaidAmount(e.target.value)}
                      />
                      <Input
                        placeholder="bKash ref"
                        className="w-24"
                        value={bkashRef}
                        onChange={(e) => setBkashRef(e.target.value)}
                      />
                      <Input
                        placeholder="Phone"
                        className="w-28"
                        value={bkashPhone}
                        onChange={(e) => setBkashPhone(e.target.value)}
                      />
                      <Button size="sm" onClick={() => markAsPaid(r.id)} disabled={saving}>
                        {saving ? "…" : "Save"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setPayingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
