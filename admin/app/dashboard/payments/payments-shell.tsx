"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { PaymentsContentSkeleton } from "./loading";

const REQUESTS_STATUSES = ["all", "pending", "approved", "rejected"] as const;
const WEEKLY_STATUSES = ["all", "pending", "paid", "overdue", "deactivated"] as const;

export function PaymentsShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const tab = searchParams.get("tab") === "weekly" ? "weekly" : "requests";
  const status = searchParams.get("status") || "pending";
  const wstatus = searchParams.get("wstatus") || "all";

  function navigate(href: string) {
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <>
      <div className="p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Payments</h1>
        <p className="mt-1 text-sm text-slate-400">
          Payment requests and rider weekly payouts.
        </p>

        {/* Main tabs — button + router.push so UI never freezes */}
        <div className="mt-6 flex gap-1 rounded-lg border border-slate-600 bg-slate-800/80 p-0.5 w-fit">
          <button
            type="button"
            onClick={() => navigate("/dashboard/payments?tab=requests")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === "requests"
                ? "bg-[var(--primary)] text-white"
                : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
          >
            Payment requests
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/payments?tab=weekly")}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === "weekly"
                ? "bg-[var(--primary)] text-white"
                : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
          >
            Weekly payments
          </button>
        </div>

        {/* Status filter pills */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-slate-400">Status:</span>
          <div className="flex rounded-lg border border-slate-600 bg-slate-800/80">
            {tab === "requests"
              ? REQUESTS_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => navigate(`/dashboard/payments?tab=requests&status=${s}&page=1`)}
                    className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                      status === s
                        ? "bg-[var(--primary)] text-white"
                        : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))
              : WEEKLY_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => navigate(`/dashboard/payments?tab=weekly&wstatus=${s}&wpage=1`)}
                    className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                      wstatus === s
                        ? "bg-[var(--primary)] text-white"
                        : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
          </div>
        </div>
      </div>

      {isPending ? <PaymentsContentSkeleton /> : children}
    </>
  );
}
