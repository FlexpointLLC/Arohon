"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SelectNative } from "@/components/ui/select-native";

// Must match DB CHECK constraint: rides_status_check
const STATUSES = [
  "all", "pending", "searching", "queued", "driver_assigned", "driver_arriving",
  "in_progress", "completed", "cancelled",
];

export function RidesFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") next.set(key, value);
    else next.delete(key);
    router.push(`/dashboard/rides?${next.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="w-40 max-w-full shrink-0">
        <SelectNative
          value={searchParams.get("status") ?? "all"}
          onChange={(e) => setParam("status", e.target.value)}
          className="w-full"
          options={STATUSES.map((s) => ({
          value: s,
              label: s === "all" ? "All statuses" : s.replace(/_/g, " "),
          }))}
        />
      </div>
      <div className="relative w-40 max-w-full shrink-0">
        <input
          type="date"
          value={searchParams.get("from") ?? ""}
          onChange={(e) => setParam("from", e.target.value)}
          className="input-sleek w-full"
        />
        {!searchParams.get("from") && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
            dd•mm•yy
          </span>
        )}
      </div>
      <span className="text-slate-400 shrink-0">to</span>
      <div className="relative w-40 max-w-full shrink-0">
        <input
          type="date"
          value={searchParams.get("to") ?? ""}
          onChange={(e) => setParam("to", e.target.value)}
          className="input-sleek w-full"
        />
        {!searchParams.get("to") && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
            dd•mm•yy
          </span>
        )}
      </div>
    </div>
  );
}
