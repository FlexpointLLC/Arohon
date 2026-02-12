"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SelectNative } from "@/components/ui/select-native";

const VERIFICATION_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
];

export function DriverStatusDropdowns({
  riderId,
  verificationStatus,
  isActive,
}: {
  riderId: string;
  verificationStatus: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [savingVerification, setSavingVerification] = useState(false);
  const [savingActive, setSavingActive] = useState(false);

  async function patchRider(updates: Record<string, unknown>) {
    const res = await fetch(`/api/riders/${riderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) router.refresh();
    return res.ok;
  }

  async function onVerificationChange(value: string) {
    setSavingVerification(true);
    await patchRider({ verification_status: value });
    setSavingVerification(false);
  }

  async function onActiveChange(value: string) {
    setSavingActive(true);
    await patchRider({ is_active: value === "yes" });
    setSavingActive(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-400">Verification</span>
        <SelectNative
          value={verificationStatus}
          onChange={(e) => onVerificationChange(e.target.value)}
          options={VERIFICATION_OPTIONS}
          variantByValue={{
            pending: "warning",
            approved: "success",
            rejected: "danger",
            suspended: "danger",
          }}
          loading={savingVerification}
          disabled={savingVerification}
          className="w-36"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-400">Active</span>
        <SelectNative
          value={isActive ? "yes" : "no"}
          onChange={(e) => onActiveChange(e.target.value)}
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ]}
          variantByValue={{ yes: "success", no: "neutral" }}
          loading={savingActive}
          disabled={savingActive}
          className="w-24"
        />
      </div>
    </div>
  );
}
