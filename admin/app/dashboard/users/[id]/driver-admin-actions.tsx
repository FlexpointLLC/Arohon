"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectNative } from "@/components/ui/select-native";

export function DriverAdminActions({
  riderId,
  userId,
  isActive,
  isBlocked,
  isOnline,
  paymentTier,
  unpaidAmount,
  fullName,
  phone,
}: {
  riderId: string;
  userId: string;
  isActive: boolean;
  isBlocked: boolean;
  isOnline: boolean;
  paymentTier: number;
  unpaidAmount: number;
  fullName: string;
  phone: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [name, setName] = useState(fullName);
  const [phoneVal, setPhoneVal] = useState(phone);

  async function patchRider(
    updates: Record<string, unknown>,
    field?: string
  ) {
    const key = field ?? "general";
    setSavingField(key);
    setSaving(true);
    const res = await fetch(`/api/riders/${riderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    setSavingField(null);
    if (res.ok) router.refresh();
  }

  async function patchUser(updates: Record<string, unknown>) {
    setSavingField("profile");
    setSaving(true);
    const res = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    setSaving(false);
    setSavingField(null);
    if (res.ok) router.refresh();
  }

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/50">
      {/* ── Row 1 · Driver Status ──────────────────── */}
      <div className="border-b border-slate-700/40 px-5 py-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Driver status
        </h3>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <DropdownField
            label="Availability"
            value={isOnline ? "online" : "offline"}
            options={[{ value: "online", label: "Online" }, { value: "offline", label: "Offline" }]}
            variants={{ online: "success", offline: "neutral" }}
            loading={savingField === "availability"}
            onChange={(v) => patchRider({ is_online: v === "online" }, "availability")}
            width="w-28"
          />
          <DropdownField
            label="Active"
            value={isActive ? "yes" : "no"}
            options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]}
            variants={{ yes: "success", no: "neutral" }}
            loading={savingField === "active"}
            onChange={(v) => patchRider({ is_active: v === "yes" }, "active")}
            width="w-24"
          />
          <DropdownField
            label="Blocked"
            value={isBlocked ? "yes" : "no"}
            options={[{ value: "no", label: "No" }, { value: "yes", label: "Yes" }]}
            variants={{ yes: "danger", no: "success" }}
            loading={savingField === "blocked"}
            onChange={(v) => patchRider({ is_blocked: v === "yes" }, "blocked")}
            width="w-24"
          />

          {/* read-only: tier badge + payments link (horizontal) */}
          <div className="ml-auto flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/20 px-2.5 py-1 text-xs font-semibold text-amber-400">
              <Crown className="h-3.5 w-3.5 shrink-0" />
              Tier {paymentTier}
            </span>
            <Link
              href="/dashboard/payments"
              className="text-xs text-[var(--primary)] hover:underline"
            >
              Payments →
            </Link>
          </div>
        </div>
      </div>

      {/* ── Row 2 · User Profile ──────────────────── */}
      <div className="px-5 py-4">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Edit profile
        </h3>
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="mb-1 block text-[11px] text-slate-500">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="input-sleek w-48 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-slate-500">Phone</label>
            <input
              type="text"
              value={phoneVal}
              onChange={(e) => setPhoneVal(e.target.value)}
              placeholder="Phone"
              className="input-sleek w-40 py-1.5 text-sm"
            />
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() =>
              patchUser({ full_name: name, phone: phoneVal })
            }
            disabled={saving}
          >
            {savingField === "profile" ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Tiny reusable dropdown row ──────────────────────── */

function DropdownField({
  label,
  value,
  options,
  variants,
  loading,
  onChange,
  width,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  variants: Record<string, "success" | "warning" | "danger" | "neutral">;
  loading: boolean;
  onChange: (v: string) => void;
  width: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">{label}</span>
      <SelectNative
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={options}
        variantByValue={variants}
        loading={loading}
        disabled={loading}
        className={width}
      />
    </div>
  );
}
