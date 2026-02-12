"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SelectNative } from "@/components/ui/select-native";

// Must match DB CHECK constraint: rides_status_check
const STATUS_OPTIONS = ["pending", "searching", "queued", "driver_assigned", "driver_arriving", "in_progress", "completed", "cancelled"];

export function RideAdminActions({
  rideId,
  currentStatus,
}: {
  rideId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelBy, setCancelBy] = useState("admin");

  async function updateStatus() {
    setSaving(true);
    const body: Record<string, unknown> = { status };
    if (status === "cancelled") {
      body.cancelled_at = new Date().toISOString();
      body.cancellation_reason = cancelReason || "Cancelled by admin";
      body.cancelled_by = cancelBy;
    }
    await fetch(`/api/rides/${rideId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    router.refresh();
  }

  async function reRunCompletion() {
    setCompleting(true);
    const res = await fetch(`/api/rides/${rideId}/complete-background`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const json = await res.json().catch(() => ({}));
    setCompleting(false);
    if (res.ok && json.ok) {
      router.refresh();
    } else {
      alert(json?.error ?? "Re-run completion failed");
    }
  }

  return (
    <div className="card mt-6 p-6">
      <h2 className="mb-4 font-semibold text-white">Admin actions</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-xs text-slate-400">Status</label>
          <div className="flex flex-wrap items-center gap-2">
            <SelectNative
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-44"
              options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
            />
            <Button type="button" size="sm" onClick={updateStatus} disabled={saving}>
              {saving ? "Saving…" : "Update status"}
            </Button>
          </div>
        </div>
        {status === "completed" && (
          <div className="rounded-lg border border-slate-600/80 bg-slate-800/50 p-3">
            <p className="mb-2 text-xs text-slate-400">Re-run financial completion (fn_complete_ride_background)</p>
            <p className="mb-2 text-[11px] text-slate-500">Use when transaction/invoice/earnings are missing for this ride. Idempotent.</p>
            <Button type="button" variant="outline" size="sm" onClick={reRunCompletion} disabled={completing}>
              {completing ? "Running…" : "Re-run completion"}
            </Button>
          </div>
        )}
        {status === "cancelled" && (
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Cancellation reason</label>
              <input type="text" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="e.g. Cancelled by admin" className="input-sleek w-full py-1.5 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Cancelled by</label>
              <input type="text" value={cancelBy} onChange={(e) => setCancelBy(e.target.value)} className="input-sleek w-full py-1.5 text-sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
