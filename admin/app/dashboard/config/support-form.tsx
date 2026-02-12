"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SupportForm({ initialPhone }: { initialPhone: string }) {
  const router = useRouter();
  const [support, setSupport] = useState(initialPhone);
  const [saving, setSaving] = useState(false);

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
    <div className="flex flex-wrap items-center gap-3">
      <Input
        value={support}
        onChange={(e) => setSupport(e.target.value)}
        placeholder="+880..."
        className="min-w-[200px] flex-1 bg-slate-800/80 border-slate-600"
      />
      <Button onClick={saveSupportPhone} disabled={saving}>
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
