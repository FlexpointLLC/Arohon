import { supabaseAdmin } from "@/lib/supabase/server";
import { TablePagination } from "@/components/ui/table-pagination";
import { TableRefreshButton } from "@/components/ui/table-refresh-button";
import { RidesFilters } from "./rides-filters";
import { RidesTable } from "./rides-table";

const DEFAULT_PAGE_SIZE = 25;

const RIDES_SORT_COLUMNS = ["created_at", "completed_at", "final_fare", "status", "payment_status"] as const;

export default async function RidesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; from?: string; to?: string; page?: string; pageSize?: string; sortBy?: string; sortOrder?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(10, parseInt(params.pageSize ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const sortBy = RIDES_SORT_COLUMNS.includes(params.sortBy as any) ? params.sortBy! : "created_at";
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  let query = supabaseAdmin
    .from("rides")
    .select(
      "id, status, ride_type, pickup_address, dropoff_address, final_fare, surge_amount, payment_status, created_at, completed_at, customer_id, rider_id",
      { count: "exact" }
    )
    .order(sortBy, { ascending: sortOrder === "asc" })
    .range(from, to);

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }
  if (params.from) {
    query = query.gte("created_at", `${params.from}T00:00:00`);
  }
  if (params.to) {
    query = query.lte("created_at", `${params.to}T23:59:59`);
  }

  const { data: rides, count } = await query;

  const totalCount = count ?? 0;
  const searchParamsRecord: Record<string, string> = {};
  if (params.status) searchParamsRecord.status = params.status;
  if (params.from) searchParamsRecord.from = params.from;
  if (params.to) searchParamsRecord.to = params.to;
  if (params.page) searchParamsRecord.page = params.page;
  if (params.pageSize) searchParamsRecord.pageSize = params.pageSize;
  searchParamsRecord.sortBy = sortBy;
  searchParamsRecord.sortOrder = sortOrder;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Rides</h1>
      <p className="mt-1 text-sm text-slate-400">
        Filter and inspect ride history. Change status and payment from the table.
      </p>
      <div className="mt-6">
        <RidesFilters />
      </div>
      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-end gap-2 border-b border-slate-700/50 bg-slate-800/30 px-4 py-2">
          <TableRefreshButton />
        </div>
        <RidesTable rides={rides ?? []} sortBy={sortBy} sortOrder={sortOrder} basePath="/dashboard/rides" searchParams={searchParamsRecord} />
        <TablePagination
          basePath="/dashboard/rides"
          searchParams={searchParamsRecord}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
