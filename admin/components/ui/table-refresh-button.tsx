"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableRefreshButtonProps {
  onRefresh?: () => void;
  className?: string;
  size?: "sm" | "md";
}

export function TableRefreshButton({ onRefresh, className, size = "sm" }: TableRefreshButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (onRefresh) {
      onRefresh();
      return;
    }
    startTransition(() => {
      router.refresh();
    });
  }

  const isRefreshing = isPending;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isRefreshing}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-800/80 px-2.5 py-1.5 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-1 focus:ring-[var(--primary)] disabled:opacity-60",
        size === "md" && "px-3 py-2 text-sm",
        className
      )}
      aria-label="Refresh table"
    >
      <Loader2 className={cn("text-slate-400", isRefreshing && "animate-spin")} size={size === "md" ? 18 : 16} />
      <span className="text-xs font-medium">{isRefreshing ? "Refreshing…" : "Refresh"}</span>
    </button>
  );
}
