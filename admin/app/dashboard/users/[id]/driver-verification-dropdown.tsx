"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SelectNative } from "@/components/ui/select-native";

const OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
];

export function DriverVerificationDropdown({
  riderId,
  verificationStatus,
}: {
  riderId: string;
  verificationStatus: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function onChange(value: string) {
    setSaving(true);
    const res = await fetch(`/api/riders/${riderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verification_status: value }),
    });
    setSaving(false);
    if (res.ok) router.refresh();
  }

  return (
    <SelectNative
      value={verificationStatus}
      onChange={(e) => onChange(e.target.value)}
      options={OPTIONS}
      variantByValue={{
        pending: "warning",
        approved: "success",
        rejected: "danger",
        suspended: "danger",
      }}
      loading={saving}
      disabled={saving}
      className="w-36"
    />
  );
}
