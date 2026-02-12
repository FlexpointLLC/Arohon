"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ReportActions({
  reportId,
  currentNotes,
}: {
  reportId: string;
  currentStatus: string;
  currentNotes: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(currentNotes);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_notes: notes }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to save: ${data.error ?? res.statusText}`);
        return;
      }
      router.refresh();
    } catch (err) {
      alert(`Network error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs text-slate-400">Admin notes</label>
        <textarea
          className="input-sleek min-h-[80px] w-full"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this report…"
        />
      </div>
      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save notes"}
      </Button>
    </div>
  );
}
