"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function PaymentsTabBar() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "weekly" ? "weekly" : "requests";
  const status = searchParams.get("status") || "pending";
  const wstatus = searchParams.get("wstatus") || "all";

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Payments</h1>
      <p className="mt-1 text-sm text-slate-400">
        Payment requests and rider weekly payouts.
      </p>

      {/* Main tabs — instant switch via URL */}
      <div className="mt-6 flex gap-1 rounded-lg border border-slate-600 bg-slate-800/80 p-0.5 w-fit">
        <Link
          href="/dashboard/payments?tab=requests"
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "requests"
              ? "bg-[var(--primary)] text-white"
              : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          Payment requests
        </Link>
        <Link
          href="/dashboard/payments?tab=weekly"
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "weekly"
              ? "bg-[var(--primary)] text-white"
              : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          Weekly payments
        </Link>
      </div>

      {/* Status filter pills — follow URL so active state is correct during loading */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-slate-400">Status:</span>
        <div className="flex rounded-lg border border-slate-600 bg-slate-800/80">
          {tab === "requests"
            ? (["all", "pending", "approved", "rejected"] as const).map((s) => (
                <Link
                  key={s}
                  href={`/dashboard/payments?tab=requests&status=${s}&page=1`}
                  className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    status === s
                      ? "bg-[var(--primary)] text-white"
                      : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  }`}
                >
                  {s}
                </Link>
              ))
            : (["all", "pending", "paid", "overdue", "deactivated"] as const).map((s) => (
                <Link
                  key={s}
                  href={`/dashboard/payments?tab=weekly&wstatus=${s}&wpage=1`}
                  className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    wstatus === s
                      ? "bg-[var(--primary)] text-white"
                      : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  }`}
                >
                  {s}
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
