"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SelectNative } from "@/components/ui/select-native";

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export function ReportStatusDropdown({
  reportId,
  currentStatus,
}: {
  reportId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function onStatusChange(value: string) {
    setSaving(true);
    const res = await fetch(`/api/reports/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: value }),
    });
    setSaving(false);
    if (res.ok) router.refresh();
  }

  return (
    <SelectNative
      value={currentStatus}
      onChange={(e) => onStatusChange(e.target.value)}
      options={STATUS_OPTIONS}
      variantByValue={{
        open: "warning",
        in_progress: "warning",
        resolved: "success",
        closed: "danger",
      }}
      loading={saving}
      disabled={saving}
      className="w-36"
    />
  );
}
