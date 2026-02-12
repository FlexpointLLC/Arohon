import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { TableRefreshButton } from "@/components/ui/table-refresh-button";
import { formatDate } from "@/lib/format-date";

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "rewarded"
      ? "badge-success"
      : status === "completed"
        ? "badge-warning"
        : "badge-warning";
  return <span className={cls}>{status}</span>;
}

export default async function ReferralsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; ustatus?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab === "usage" ? "usage" : "codes";
  const ustatus =
    params.ustatus && ["all", "pending", "completed", "rewarded"].includes(params.ustatus)
      ? params.ustatus
      : "all";

  // ---- Referral codes ----
  const { data: codesRaw } = await supabaseAdmin
    .from("referrals")
    .select("id, user_id, referral_code, total_referrals, total_earnings, created_at, users!inner(full_name, phone)")
    .order("total_referrals", { ascending: false })
    .limit(100);
  const codes = (codesRaw ?? []) as any[];

  const totalEarnings = codes.reduce((s, c) => s + Number(c.total_earnings ?? 0), 0);
  const totalReferrals = codes.reduce((s, c) => s + Number(c.total_referrals ?? 0), 0);

  // ---- Referral usage ----
  let usageQuery = supabaseAdmin
    .from("referral_usage")
    .select("id, referrer_id, referred_user_id, referral_code, status, reward_amount, completed_at, rewarded_at, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (ustatus !== "all") usageQuery = usageQuery.eq("status", ustatus);

  const { data: usageRaw } = await usageQuery;
  const usage = (usageRaw ?? []) as any[];

  const usagePending = usage.filter((u) => u.status === "pending").length;
  const usageCompleted = usage.filter((u) => u.status === "completed").length;
  const usageRewarded = usage.filter((u) => u.status === "rewarded").length;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Referrals</h1>
      <p className="mt-1 text-sm text-slate-400">
        Referral codes and usage tracking.
      </p>

      {/* summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <p className="text-xs font-medium uppercase text-slate-400">Users with codes</p>
          <p className="mt-1 text-2xl font-semibold text-white">{codes.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase text-slate-400">Total referrals</p>
          <p className="mt-1 text-2xl font-semibold text-white">{totalReferrals}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase text-emerald-400">Total earnings</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-400">
            ৳{totalEarnings.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase text-amber-400">Pending usage</p>
          <p className="mt-1 text-2xl font-semibold text-amber-400">{usagePending}</p>
        </div>
      </div>

      {/* tabs */}
      <div className="mt-6 flex gap-1 rounded-lg border border-slate-600 bg-slate-800/80 p-0.5 w-fit">
        <Link
          href="/dashboard/referrals?tab=codes"
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "codes"
              ? "bg-[var(--primary)] text-white"
              : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          Referral codes
        </Link>
        <Link
          href="/dashboard/referrals?tab=usage"
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "usage"
              ? "bg-[var(--primary)] text-white"
              : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          Usage history
        </Link>
      </div>

      {tab === "codes" ? (
        <div className="card mt-4 overflow-hidden">
          <div className="flex items-center justify-end gap-2 border-b border-slate-700/50 bg-slate-800/30 px-4 py-2">
            <TableRefreshButton />
          </div>
          <table className="table-sleek">
            <thead>
              <tr>
                <th>User</th>
                <th>Referral code</th>
                <th className="text-right">Total referrals</th>
                <th className="text-right">Total earnings (৳)</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {codes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No referral codes found.
                  </td>
                </tr>
              ) : (
                codes.map((c: any) => {
                  const user = c.users;
                  return (
                    <tr key={c.id}>
                      <td className="text-slate-200">{user?.full_name ?? user?.phone ?? "—"}</td>
                      <td className="font-mono text-sm text-[var(--primary)]">{c.referral_code}</td>
                      <td className="text-right text-slate-300">{c.total_referrals ?? 0}</td>
                      <td className="text-right text-slate-300">{Number(c.total_earnings ?? 0).toFixed(2)}</td>
                      <td className="text-slate-400">{formatDate(c.created_at)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {/* usage status filter */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-slate-400">Status:</span>
            <div className="flex rounded-lg border border-slate-600 bg-slate-800/80">
              {["all", "pending", "completed", "rewarded"].map((s) => (
                <Link
                  key={s}
                  href={`/dashboard/referrals?tab=usage&ustatus=${s}`}
                  className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                    ustatus === s
                      ? "bg-[var(--primary)] text-white"
                      : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  }`}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          <div className="card mt-4 overflow-hidden">
            <div className="flex items-center justify-end gap-2 border-b border-slate-700/50 bg-slate-800/30 px-4 py-2">
              <TableRefreshButton />
            </div>
            <table className="table-sleek">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Status</th>
                  <th className="text-right">Reward (৳)</th>
                  <th>Completed</th>
                  <th>Rewarded</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {usage.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No referral usage records found.
                    </td>
                  </tr>
                ) : (
                  usage.map((u: any) => (
                    <tr key={u.id}>
                      <td className="font-mono text-sm text-[var(--primary)]">{u.referral_code}</td>
                      <td><StatusBadge status={u.status} /></td>
                      <td className="text-right text-slate-300">{Number(u.reward_amount ?? 0).toFixed(2)}</td>
                      <td className="text-slate-400 text-xs">
                        {u.completed_at ? formatDate(u.completed_at) : "—"}
                      </td>
                      <td className="text-slate-400 text-xs">
                        {u.rewarded_at ? formatDate(u.rewarded_at) : "—"}
                      </td>
                      <td className="text-slate-400 text-xs">{formatDate(u.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
