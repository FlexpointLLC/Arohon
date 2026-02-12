"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ApproveRejectButtons({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  async function handleApprove() {
    setLoading("approve");
    const res = await fetch("/api/payment-requests/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId }),
    });
    setLoading(null);
    if (res.ok) router.refresh();
  }

  async function handleReject() {
    if (!rejectReason.trim()) return;
    setLoading("reject");
    const res = await fetch("/api/payment-requests/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, reason: rejectReason }),
    });
    setLoading(null);
    setShowReject(false);
    setRejectReason("");
    if (res.ok) router.refresh();
  }

  if (showReject) {
    return (
      <div className="flex items-center gap-2">
        <Input placeholder="Rejection reason" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className="w-40" />
        <Button variant="destructive" size="sm" onClick={handleReject} disabled={loading === "reject" || !rejectReason.trim()}>Submit</Button>
        <Button variant="ghost" size="sm" onClick={() => setShowReject(false)}>Cancel</Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" onClick={handleApprove} disabled={!!loading}>{loading === "approve" ? "…" : "Approve"}</Button>
      <Button variant="destructive" size="sm" onClick={() => setShowReject(true)} disabled={!!loading}>Reject</Button>
    </div>
  );
}
