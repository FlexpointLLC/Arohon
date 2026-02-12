import { supabaseAdmin } from "@/lib/supabase/server";
import { TablePagination } from "@/components/ui/table-pagination";
import { TableRefreshButton } from "@/components/ui/table-refresh-button";
import { PaymentRequestsTable } from "./payment-requests-table";
import { WeeklyPaymentsTable } from "./weekly-payments-table";

const DEFAULT_PAGE_SIZE = 25;

/** Always fetch fresh data when switching tabs/filters so approved items don’t reappear as pending */
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    status?: string;
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: string;
    wstatus?: string;
    wpage?: string;
    wsortBy?: string;
    wsortOrder?: string;
  }>;
}) {
  const params = await searchParams;
  const tab = params.tab === "weekly" ? "weekly" : "requests";

  // --- Payment requests tab ---
  const REQ_SORT = ["created_at", "amount", "status"] as const;
  const statusFilter =
    params.status && ["all", "pending", "approved", "rejected"].includes(params.status)
      ? params.status
      : "pending";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(10, parseInt(params.pageSize ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
  );
  const reqSortBy = REQ_SORT.includes(params.sortBy as any) ? params.sortBy! : "created_at";
  const reqSortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  let requestsQuery = supabaseAdmin
    .from("payment_requests")
    .select(
      "id, rider_id, amount, status, rider_phone_number, notes, created_at, riders ( users ( full_name, phone ) )",
      { count: "exact" }
    )
    .order(reqSortBy, { ascending: reqSortOrder === "asc" });

  if (statusFilter !== "all") requestsQuery = requestsQuery.eq("status", statusFilter);

  const reqFrom = (page - 1) * pageSize;
  requestsQuery = requestsQuery.range(reqFrom, reqFrom + pageSize - 1);

  const { data: requestsRows, count: requestsCount } = await requestsQuery;
  const requestsList = (requestsRows ?? []) as any[];

  const { count: pendingCount } = await supabaseAdmin
    .from("payment_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: approvedCount } = await supabaseAdmin
    .from("payment_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "approved");

  const { count: rejectedCount } = await supabaseAdmin
    .from("payment_requests")
    .select("id", { count: "exact", head: true })
    .eq("status", "rejected");

  // --- Weekly payments tab ---
  const wstatus =
    params.wstatus && ["all", "pending", "paid", "overdue", "deactivated"].includes(params.wstatus)
      ? params.wstatus
      : "all";
  const wpage = Math.max(1, parseInt(params.wpage ?? "1", 10) || 1);
  const wpageSize = 25;

  const WEEK_SORT = ["week_start_date", "net_earnings", "payment_status", "paid_at"] as const;
  const wSortBy = WEEK_SORT.includes(params.wsortBy as any) ? params.wsortBy! : "week_start_date";
  const wSortOrder = params.wsortOrder === "asc" ? "asc" : "desc";

  let weeklyQuery = supabaseAdmin
    .from("rider_weekly_payments")
    .select(
      "id, rider_id, week_start_date, week_end_date, total_rides, total_fare_collected, commission_percentage, commission_amount, net_earnings, payment_status, paid_at, paid_amount, bkash_reference, bkash_phone_number, riders ( users ( full_name, phone ) )",
      { count: "exact" }
    )
    .order(wSortBy, { ascending: wSortOrder === "asc" });

  if (wstatus !== "all") weeklyQuery = weeklyQuery.eq("payment_status", wstatus);

  const wFrom = (wpage - 1) * wpageSize;
  weeklyQuery = weeklyQuery.range(wFrom, wFrom + wpageSize - 1);

  const { data: weeklyRows, count: weeklyCount } = await weeklyQuery;
  const weeklyList = (weeklyRows ?? []) as any[];

  // summary stats for weekly
  const { count: weeklyPendingCount } = await supabaseAdmin
    .from("rider_weekly_payments")
    .select("id", { count: "exact", head: true })
    .eq("payment_status", "pending");

  const { count: weeklyOverdueCount } = await supabaseAdmin
    .from("rider_weekly_payments")
    .select("id", { count: "exact", head: true })
    .eq("payment_status", "overdue");

  return (
    <div className="px-8 pb-8 pt-0">
      {tab === "requests" ? (
        <>
          {/* payment requests summary stats */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="card p-4">
              <p className="text-xs font-medium uppercase text-slate-400">Total requests</p>
              <p className="mt-1 text-2xl font-semibold text-white">
                {(pendingCount ?? 0) + (approvedCount ?? 0) + (rejectedCount ?? 0)}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-medium uppercase text-amber-400">Pending</p>
              <p className="mt-1 text-2xl font-semibold text-amber-400">{pendingCount ?? 0}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-medium uppercase text-emerald-400">Approved</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-400">{approvedCount ?? 0}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-medium uppercase text-red-400">Rejected</p>
              <p className="mt-1 text-2xl font-semibold text-red-400">{rejectedCount ?? 0}</p>
            </div>
          </div>

          <div className="card mt-4 overflow-hidden">
            <div className="flex items-center justify-end gap-2 border-b border-slate-700/50 bg-slate-800/30 px-4 py-2">
              <TableRefreshButton />
            </div>
            <PaymentRequestsTable
              key={statusFilter}
              list={requestsList}
              statusFilter={statusFilter}
              sortBy={reqSortBy}
              sortOrder={reqSortOrder}
              basePath="/dashboard/payments"
              searchParams={{ tab: "requests", ...(statusFilter !== "all" && { status: statusFilter }), sortBy: reqSortBy, sortOrder: reqSortOrder, page: String(page), pageSize: String(pageSize) }}
            />
            <TablePagination
              basePath="/dashboard/payments"
              searchParams={{ tab: "requests", ...(statusFilter !== "all" && { status: statusFilter }), sortBy: reqSortBy, sortOrder: reqSortOrder }}
              page={page}
              pageSize={pageSize}
              totalCount={requestsCount ?? 0}
            />
          </div>
        </>
      ) : (
        <>
          {/* weekly summary stats */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-4">
              <p className="text-xs font-medium uppercase text-slate-400">Total weekly records</p>
              <p className="mt-1 text-2xl font-semibold text-white">{weeklyCount ?? 0}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-medium uppercase text-amber-400">Pending</p>
              <p className="mt-1 text-2xl font-semibold text-amber-400">{weeklyPendingCount ?? 0}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-medium uppercase text-red-400">Overdue</p>
              <p className="mt-1 text-2xl font-semibold text-red-400">{weeklyOverdueCount ?? 0}</p>
            </div>
          </div>

          <div className="card mt-4 overflow-hidden">
            <div className="flex items-center justify-end gap-2 border-b border-slate-700/50 bg-slate-800/30 px-4 py-2">
              <TableRefreshButton />
            </div>
            <WeeklyPaymentsTable
              rows={weeklyList}
              sortBy={wSortBy}
              sortOrder={wSortOrder}
              basePath="/dashboard/payments"
              searchParams={{ tab: "weekly", wstatus, wsortBy: wSortBy, wsortOrder: wSortOrder, page: String(wpage), pageSize: String(wpageSize) }}
            />
            <TablePagination
              basePath="/dashboard/payments"
              searchParams={{ tab: "weekly", wstatus, wsortBy: wSortBy, wsortOrder: wSortOrder }}
              page={wpage}
              pageSize={wpageSize}
              totalCount={weeklyCount ?? 0}
            />
          </div>
        </>
      )}
    </div>
  );
}
