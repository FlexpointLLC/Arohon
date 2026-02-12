"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function VerifyActions({
  riderId,
  verificationStatus,
  isActive,
}: {
  riderId: string;
  verificationStatus: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  async function updateStatus(status: string, reason?: string) {
    setLoading(status);
    await fetch("/api/riders/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ riderId, status, reason }),
    });
    setLoading(null);
    setShowReject(false);
    setRejectReason("");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {verificationStatus === "pending" && (
        <>
          <Button type="button" size="sm" onClick={() => updateStatus("approved")} disabled={!!loading}>
            {loading === "approved" ? "…" : "Approve"}
          </Button>
          {!showReject ? (
            <Button type="button" variant="outline" size="sm" onClick={() => setShowReject(true)} disabled={!!loading} className="border-red-500/50 text-red-400 hover:bg-red-500/20">
              Reject
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <input type="text" placeholder="Rejection reason" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="input-sleek w-48 py-1.5 text-sm" />
              <Button type="button" variant="destructive" size="sm" onClick={() => updateStatus("rejected", rejectReason)} disabled={loading === "rejected" || !rejectReason.trim()}>Submit</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowReject(false)}>Cancel</Button>
            </div>
          )}
        </>
      )}
      <span className="text-sm text-slate-400">Status: {verificationStatus} · {isActive ? "Active" : "Inactive"}</span>
    </div>
  );
}
