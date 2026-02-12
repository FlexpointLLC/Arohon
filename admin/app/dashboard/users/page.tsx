import { supabaseAdmin } from "@/lib/supabase/server";
import { TablePagination } from "@/components/ui/table-pagination";
import { TableRefreshButton } from "@/components/ui/table-refresh-button";
import { UsersTable } from "./users-table";

const DEFAULT_PAGE_SIZE = 25;
const USERS_SORT_COLUMNS = ["created_at", "total_earnings", "total_completed_trips", "verification_status"] as const;

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; sortBy?: string; sortOrder?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(10, parseInt(params.pageSize ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const sortBy = USERS_SORT_COLUMNS.includes(params.sortBy as any) ? params.sortBy! : "created_at";
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  const query = supabaseAdmin
    .from("riders")
    .select(
      `
      id,
      user_id,
      verification_status,
      is_active,
      is_blocked,
      payment_tier,
      unpaid_amount,
      total_completed_trips,
      total_earnings,
      users!inner ( id, full_name, phone, email )
    `,
      { count: "exact" }
    )
    .order(sortBy, { ascending: sortOrder === "asc" })
    .range(from, to);

  const { data: riders, count } = await query;

  const list = (riders ?? []) as unknown as Array<{
    id: string;
    user_id: string;
    verification_status: string;
    is_active: boolean;
    is_blocked: boolean | null;
    payment_tier: number | null;
    unpaid_amount: number | null;
    total_completed_trips: number | null;
    total_earnings: number | null;
    users: { id: string; full_name: string | null; phone: string | null; email: string | null };
  }>;

  const totalCount = count ?? 0;
  const searchParamsRecord: Record<string, string> = {};
  if (params.page) searchParamsRecord.page = params.page;
  if (params.pageSize) searchParamsRecord.pageSize = params.pageSize;
  searchParamsRecord.sortBy = sortBy;
  searchParamsRecord.sortOrder = sortOrder;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Users (Drivers)</h1>
      <p className="mt-1 text-sm text-slate-400">
        Driver accounts. Change verification, active, and blocked from the table.
      </p>
      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-end gap-2 border-b border-slate-700/50 bg-slate-800/30 px-4 py-2">
          <TableRefreshButton />
        </div>
        <UsersTable list={list} sortBy={sortBy} sortOrder={sortOrder} basePath="/dashboard/users" searchParams={searchParamsRecord} />
        <TablePagination
          basePath="/dashboard/users"
          searchParams={searchParamsRecord}
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
