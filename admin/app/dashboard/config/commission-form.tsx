"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const MIN = 0;
const MAX = 100;
const STEP = 1;

export function CommissionForm({ initialPercent }: { initialPercent: number }) {
  const router = useRouter();
  const [value, setValue] = useState(() =>
    Math.min(MAX, Math.max(MIN, Math.round(initialPercent)))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function decrement() {
    setValue((v) => Math.max(MIN, v - STEP));
  }

  function increment() {
    setValue((v) => Math.min(MAX, v + STEP));
  }

  async function saveCommission() {
    setError(null);
    setSaving(true);
    const res = await fetch("/api/config/commission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data?.error ?? `Save failed (${res.status})`);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-fit items-center gap-0 rounded-xl border border-slate-600 bg-slate-800/80 overflow-hidden">
        <button
          type="button"
          onClick={decrement}
          disabled={value <= MIN}
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center border-r border-slate-600 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:pointer-events-none",
          )}
          aria-label="Decrease"
        >
          <Minus className="h-7 w-7" weight="bold" />
        </button>
        <span className="flex h-14 min-w-[5rem] items-center justify-center px-6 text-3xl font-semibold tabular-nums text-white">
          {value}%
        </span>
        <button
          type="button"
          onClick={increment}
          disabled={value >= MAX}
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center border-l border-slate-600 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:pointer-events-none",
          )}
          aria-label="Increase"
        >
          <Plus className="h-7 w-7" weight="bold" />
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <Button onClick={saveCommission} disabled={saving} className="w-fit">
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
