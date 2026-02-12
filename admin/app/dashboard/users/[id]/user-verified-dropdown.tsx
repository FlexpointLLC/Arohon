"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SelectNative } from "@/components/ui/select-native";

export function UserVerifiedDropdown({
  userId,
  isVerified,
}: {
  userId: string;
  isVerified: boolean;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function onChange(value: string) {
    setSaving(true);
    const res = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_verified: value === "yes" }),
    });
    setSaving(false);
    if (res.ok) router.refresh();
  }

  return (
    <SelectNative
      value={isVerified ? "yes" : "no"}
      onChange={(e) => onChange(e.target.value)}
      options={[
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ]}
      variantByValue={{ yes: "success", no: "neutral" }}
      loading={saving}
      disabled={saving}
      className="w-24"
    />
  );
}
