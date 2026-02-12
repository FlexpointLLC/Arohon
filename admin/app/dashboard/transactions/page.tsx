import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { TablePagination } from "@/components/ui/table-pagination";
import { TableRefreshButton } from "@/components/ui/table-refresh-button";
import { TransactionsTable } from "./transactions-table";

const DEFAULT_PAGE_SIZE = 25;
const TXN_SORT_COLUMNS = ["created_at", "amount", "payment_received_at", "status"] as const;

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    method?: string;
    from?: string;
    to?: string;
    page?: string;
    pageSize?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const params = await searchParams;
  const statusFilter =
    params.status && ["all", "pending", "completed", "cancelled"].includes(params.status)
      ? params.status
      : "all";
  const methodFilter =
    params.method && ["all", "cash", "bkash", "card"].includes(params.method)
      ? params.method
      : "all";
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(10, parseInt(params.pageSize ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
  );

  // summary
  const { data: aggRows } = await supabaseAdmin
    .from("transactions")
    .select("amount, status");
  const completedTotal = (aggRows ?? [])
    .filter((r) => r.status === "completed")
    .reduce((s, r) => s + Number(r.amount ?? 0), 0);
  const pendingCount = (aggRows ?? []).filter((r) => r.status === "pending").length;

  // list
  const sortBy = TXN_SORT_COLUMNS.includes(params.sortBy as any) ? params.sortBy! : "created_at";
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  let query = supabaseAdmin
    .from("transactions")
    .select(
      "id, ride_id, customer_id, rider_id, transaction_type, amount, currency, payment_method, status, payment_received_at, created_at",
      { count: "exact" }
    )
    .order(sortBy, { ascending: sortOrder === "asc" });

  if (statusFilter !== "all") query = query.eq("status", statusFilter);
  if (methodFilter !== "all") query = query.eq("payment_method", methodFilter);
  if (params.from) query = query.gte("created_at", params.from);
  if (params.to) query = query.lte("created_at", params.to + "T23:59:59Z");

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data: txns, count: filteredCount } = await query;
  const list = txns ?? [];

  const spObj: Record<string, string> = {};
  if (statusFilter !== "all") spObj.status = statusFilter;
  if (methodFilter !== "all") spObj.method = methodFilter;
  if (params.from) spObj.from = params.from;
  if (params.to) spObj.to = params.to;
  spObj.sortBy = sortBy;
  spObj.sortOrder = sortOrder;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Transactions</h1>
      <p className="mt-1 text-sm text-slate-400">
        Financial transactions for rides. One transaction per ride.
      </p>

      {/* summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs font-medium uppercase text-slate-400">Total transactions</p>
          <p className="mt-1 text-2xl font-semibold text-white">{(aggRows ?? []).length}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase text-emerald-400">Completed amount</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-400">
            ৳{completedTotal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-xs font-medium uppercase text-amber-400">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-amber-400">{pendingCount}</p>
        </div>
      </div>

      {/* filters */}
      <div className="mt-6 flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-xs text-slate-400">Status</label>
          <div className="flex rounded-lg border border-slate-600 bg-slate-800/80">
            {(["all", "pending", "completed", "cancelled"] as const).map((s) => (
              <Link
                key={s}
                href={`/dashboard/transactions?${new URLSearchParams({ ...spObj, status: s, page: "1" }).toString()}`}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  statusFilter === s
                    ? "bg-[var(--primary)] text-white"
                    : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-400">Method</label>
          <div className="flex rounded-lg border border-slate-600 bg-slate-800/80">
            {(["all", "cash", "bkash", "card"] as const).map((m) => (
              <Link
                key={m}
                href={`/dashboard/transactions?${new URLSearchParams({ ...spObj, method: m, page: "1" }).toString()}`}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  methodFilter === m
                    ? "bg-[var(--primary)] text-white"
                    : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                {m}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* table */}
      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-end gap-2 border-b border-slate-700/50 bg-slate-800/30 px-4 py-2">
          <TableRefreshButton />
        </div>
        <TransactionsTable
          list={list}
          page={page}
          pageSize={pageSize}
          totalCount={filteredCount ?? 0}
          searchParams={spObj}
          sortBy={sortBy}
          sortOrder={sortOrder}
          basePath="/dashboard/transactions"
        />
        <TablePagination
          basePath="/dashboard/transactions"
          searchParams={spObj}
          page={page}
          pageSize={pageSize}
          totalCount={filteredCount ?? 0}
        />
      </div>
    </div>
  );
}
