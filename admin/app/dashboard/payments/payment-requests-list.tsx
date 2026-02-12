import { supabaseAdmin } from "@/lib/supabase/server";
import { TablePagination } from "@/components/ui/table-pagination";
import { PaymentRequestsTable } from "./payment-requests-table";

export async function PaymentRequestsList({
  statusFilter = "pending",
  page = 1,
  pageSize = 25,
  searchParams = {},
}: {
  statusFilter?: string;
  page?: number;
  pageSize?: number;
  searchParams?: Record<string, string>;
}) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let q = supabaseAdmin
    .from("payment_requests")
    .select(
      `
      id,
      rider_id,
      amount,
      status,
      rider_phone_number,
      notes,
      created_at,
      riders ( users ( full_name, phone ) )
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);
  if (statusFilter && statusFilter !== "all") {
    q = q.eq("status", statusFilter);
  }
  const { data: requests, count } = await q;

  const list = (requests ?? []) as unknown as Array<{
    id: string;
    rider_id: string;
    amount: number;
    status: string;
    rider_phone_number: string | null;
    notes: string | null;
    created_at: string;
    riders: { users: { full_name: string | null; phone: string | null } | null } | null;
  }>;

  const totalCount = count ?? 0;
  const paginationParams: Record<string, string> = {};
  if (searchParams.status) paginationParams.status = searchParams.status;
  if (searchParams.page) paginationParams.page = searchParams.page;
  if (searchParams.pageSize) paginationParams.pageSize = searchParams.pageSize;

  return (
    <>
      <PaymentRequestsTable list={list} statusFilter={statusFilter} />
      <TablePagination
        basePath="/dashboard/payments"
        searchParams={paginationParams}
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
      />
    </>
  );
}
