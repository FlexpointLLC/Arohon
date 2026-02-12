"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ApproveVerificationButton({
  riderId,
  verificationStatus,
}: {
  riderId: string;
  verificationStatus: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  if (verificationStatus !== "pending") return null;

  async function handleApprove() {
    setSaving(true);
    const res = await fetch(`/api/riders/${riderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verification_status: "approved" }),
    });
    setSaving(false);
    if (res.ok) router.refresh();
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={handleApprove}
      disabled={saving}
      className="shrink-0"
    >
      {saving ? "Approving…" : "Approve"}
    </Button>
  );
}
