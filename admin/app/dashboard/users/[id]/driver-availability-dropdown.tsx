"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SelectNative } from "@/components/ui/select-native";

export function DriverAvailabilityDropdown({
  riderId,
  isOnline,
}: {
  riderId: string;
  isOnline: boolean;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function onChange(value: string) {
    setSaving(true);
    const res = await fetch(`/api/riders/${riderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_online: value === "online" }),
    });
    setSaving(false);
    if (res.ok) router.refresh();
  }

  return (
    <SelectNative
      value={isOnline ? "online" : "offline"}
      onChange={(e) => onChange(e.target.value)}
      options={[
        { value: "online", label: "Online" },
        { value: "offline", label: "Offline" },
      ]}
      variantByValue={{ online: "success", offline: "neutral" }}
      loading={saving}
      disabled={saving}
      className="w-28"
    />
  );
}
