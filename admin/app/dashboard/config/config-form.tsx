"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export function ConfigForm({
  commissionPercent,
  supportPhone,
}: {
  commissionPercent: number;
  supportPhone: string;
  driverVersion?: unknown;
  customerVersion?: unknown;
}) {
  const router = useRouter();
  const [commission, setCommission] = useState(String(commissionPercent));
  const [support, setSupport] = useState(supportPhone);
  const [saving, setSaving] = useState(false);

  async function saveCommission() {
    setSaving(true);
    try {
      const res = await fetch("/api/config/commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: Number(commission) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to save commission: ${data.error ?? res.statusText}`);
        return;
      }
    } catch (err) {
      alert(`Network error: ${err instanceof Error ? err.message : "Unknown error"}`);
      return;
    } finally {
      setSaving(false);
    }
    router.refresh();
  }

  async function saveSupportPhone() {
    setSaving(true);
    try {
      const res = await fetch("/api/config/support-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: support }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to save support phone: ${data.error ?? res.statusText}`);
        return;
      }
    } catch (err) {
      alert(`Network error: ${err instanceof Error ? err.message : "Unknown error"}`);
      return;
    } finally {
      setSaving(false);
    }
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rider commission (%)</CardTitle>
          <CardDescription>Global commission percentage. A DB trigger syncs this to all riders.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            className="w-24"
          />
          <Button onClick={saveCommission} disabled={saving}>Save</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support phone</CardTitle>
          <CardDescription>Shown in customer app &quot;Call Support&quot;.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Input
            value={support}
            onChange={(e) => setSupport(e.target.value)}
            placeholder="+880..."
            className="min-w-[200px] flex-1"
          />
          <Button onClick={saveSupportPhone} disabled={saving}>Save</Button>
        </CardContent>
      </Card>
    </div>
  );
}
