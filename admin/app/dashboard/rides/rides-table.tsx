"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SelectNative } from "@/components/ui/select-native";
import { SortableTh } from "@/components/ui/sortable-th";
import { formatDateTime } from "@/lib/format-date";

// Must match DB CHECK constraint: rides_status_check
const RIDE_STATUSES = [
  "pending", "searching", "queued", "driver_assigned", "driver_arriving",
  "in_progress", "completed", "cancelled",
];
// Must match DB CHECK constraint: rides_payment_status_check
const PAYMENT_STATUSES = ["pending", "paid", "cancelled", "—"];

type Ride = {
  id: string;
  status: string;
  ride_type: string;
  pickup_address: string;
  dropoff_address: string;
  final_fare: number | null;
  surge_amount?: number | null;
  payment_status: string | null;
  created_at: string;
  completed_at: string | null;
  customer_id: string | null;
  rider_id: string | null;
};

type SortableProps = {
  sortBy: string | null;
  sortOrder: "asc" | "desc";
  basePath: string;
  searchParams: Record<string, string>;
};

export function RidesTable({
  rides,
  sortBy = null,
  sortOrder = "desc",
  basePath = "/dashboard/rides",
  searchParams = {},
}: {
  rides: Ride[];
} & Partial<SortableProps>) {
  const router = useRouter();
  const [updating, setUpdating] = useState<{ id: string; field: string } | null>(null);

  async function updateRide(id: string, field: "status" | "payment_status", value: string) {
    const payload = value === "—" || value === "" ? { [field]: null } : { [field]: value };
    setUpdating({ id, field });
    try {
      const res = await fetch(`/api/rides/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to update ${field}: ${data.error ?? res.statusText}`);
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
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">ID</th>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Pickup → Dropoff</th>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Type</th>
          {sortBy != null ? (
            <>
              <SortableTh label="Status" sortKey="status" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} />
              <SortableTh label="Payment" sortKey="payment_status" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} />
              <SortableTh label="Fare" sortKey="final_fare" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} align="right" />
              <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Surge</th>
              <SortableTh label="Date" sortKey="created_at" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} align="right" />
            </>
          ) : (
            <>
              <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Status</th>
              <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Payment</th>
              <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Fare</th>
              <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Surge</th>
              <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Date</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {(!rides || rides.length === 0) ? (
          <tr>
            <td colSpan={8} className="py-12 text-center text-slate-400">No rides found</td>
          </tr>
        ) : (
          rides.map((ride) => (
            <tr key={ride.id}>
              <td>
                <Link href={`/dashboard/rides/${ride.id}`} className="font-mono text-xs text-[var(--primary)] hover:underline">
                  {ride.id.slice(0, 8)}…
                </Link>
              </td>
              <td className="max-w-[240px]">
                <span className="block truncate text-slate-400">
                  {ride.pickup_address} → {ride.dropoff_address}
                </span>
              </td>
              <td className="capitalize text-slate-200">{ride.ride_type}</td>
              <td>
                <div className="w-[140px] max-w-full">
                  <SelectNative
                    value={ride.status}
                    onChange={(e) => updateRide(ride.id, "status", e.target.value)}
                    disabled={updating?.id === ride.id}
                    loading={updating?.id === ride.id && updating?.field === "status"}
                    className="w-full"
                    options={RIDE_STATUSES.map((s) => ({ value: s, label: s.replace(/_/g, " ") }))}
                    variantByValue={{
                      completed: "success",
                      cancelled: "danger",
                      in_progress: "warning",
                      driver_arriving: "warning",
                      driver_assigned: "warning",
                      searching: "warning",
                      queued: "neutral",
                      pending: "neutral",
                    }}
                  />
                </div>
              </td>
              <td>
                <div className="w-[110px] max-w-full">
                  <SelectNative
                    value={ride.payment_status ?? "—"}
                    onChange={(e) => updateRide(ride.id, "payment_status", e.target.value === "—" ? "" : e.target.value)}
                    disabled={updating?.id === ride.id}
                    loading={updating?.id === ride.id && updating?.field === "payment_status"}
                    className="w-full"
                    options={PAYMENT_STATUSES.map((s) => ({ value: s === "—" ? "—" : s, label: s }))}
                    variantByValue={{ paid: "success", pending: "warning", cancelled: "danger" }}
                  />
                </div>
              </td>
              <td className="text-right font-medium text-slate-200">৳{Number(ride.final_fare ?? 0).toFixed(0)}</td>
              <td className="text-right text-slate-400">৳{Number(ride.surge_amount ?? 0).toFixed(0)}</td>
              <td className="text-right text-slate-400">{formatDateTime(ride.created_at)}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
