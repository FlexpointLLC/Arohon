import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { TablePagination } from "@/components/ui/table-pagination";
import { TableRefreshButton } from "@/components/ui/table-refresh-button";
import { SortableTh } from "@/components/ui/sortable-th";
import { formatDate } from "@/lib/format-date";
import { SupportTicketsTable } from "./support-tickets-table";

const DEFAULT_PAGE_SIZE = 25;

const REPORT_TYPES = [
  "all",
  "driver_behavior",
  "vehicle_issue",
  "payment_issue",
  "safety_concern",
  "route_issue",
  "other",
] as const;

const REPORT_STATUSES = ["all", "open", "in_progress", "resolved", "closed"] as const;

function ReportStatusBadge({ status }: { status: string }) {
  const cls =
    status === "resolved"
      ? "badge-success"
      : status === "closed"
        ? "badge-danger"
        : "badge-warning";
  return <span className={cls}>{status.replace("_", " ")}</span>;
}

function ReportTypeBadge({ type }: { type: string }) {
  const cls =
    type === "safety_concern"
      ? "badge-danger"
      : type === "driver_behavior" || type === "vehicle_issue"
        ? "badge-warning"
        : "badge-success";
  return <span className={cls}>{type.replace(/_/g, " ")}</span>;
}

export default async function SupportPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    page?: string;
    pageSize?: string;
    status?: string;
    type?: string;
    from?: string;
    to?: string;
    rpage?: string;
    rpageSize?: string;
    sortBy?: string;
    sortOrder?: string;
    rsortBy?: string;
    rsortOrder?: string;
  }>;
}) {
  const params = await searchParams;
  const tab = params.tab === "reports" ? "reports" : "tickets";

  // --- Tickets tab ---
  const TICKETS_SORT = ["created_at", "status"] as const;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(10, parseInt(params.pageSize ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
  );
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const tSortBy = TICKETS_SORT.includes(params.sortBy as any) ? params.sortBy! : "created_at";
  const tSortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  const { data: tickets, count } = await supabaseAdmin
    .from("support_tickets")
    .select("id, ticket_number, subject, status, user_id, ride_id, created_at", { count: "exact" })
    .in("status", ["open", "in_progress"])
    .order(tSortBy, { ascending: tSortOrder === "asc" })
    .range(from, to);

  const totalCount = count ?? 0;
  const ticketsSearchParams: Record<string, string> = {};
  if (params.page) ticketsSearchParams.page = params.page;
  if (params.pageSize) ticketsSearchParams.pageSize = params.pageSize;
  ticketsSearchParams.sortBy = tSortBy;
  ticketsSearchParams.sortOrder = tSortOrder;

  // --- Reports tab ---
  const rStatus = REPORT_STATUSES.includes(params.status as any) ? params.status! : "all";
  const rType = REPORT_TYPES.includes(params.type as any) ? params.type! : "all";
  const rpage = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const rpageSize = Math.min(
    100,
    Math.max(10, parseInt(params.pageSize ?? String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE)
  );

  const { count: openReports } = await supabaseAdmin
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("status", "open");

  const { count: inProgressReports } = await supabaseAdmin
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("status", "in_progress");

  const REPORTS_SORT = ["created_at", "status", "report_type"] as const;
  const rSortBy = REPORTS_SORT.includes(params.rsortBy as any) ? params.rsortBy! : "created_at";
  const rSortOrder = params.rsortOrder === "asc" ? "asc" : "desc";

  let reportsQuery = supabaseAdmin
    .from("reports")
    .select(
      "id, report_type, status, description, ride_id, ticket_id, created_at, reported_by_user_id, reported_user_id",
      { count: "exact" }
    )
    .order(rSortBy, { ascending: rSortOrder === "asc" });

  if (rStatus !== "all") reportsQuery = reportsQuery.eq("status", rStatus);
  if (rType !== "all") reportsQuery = reportsQuery.eq("report_type", rType);
  if (params.from) reportsQuery = reportsQuery.gte("created_at", params.from);
  if (params.to) reportsQuery = reportsQuery.lte("created_at", params.to + "T23:59:59Z");
  const rFrom = (rpage - 1) * rpageSize;
  reportsQuery = reportsQuery.range(rFrom, rFrom + rpageSize - 1);

  const { data: reports, count: reportsCount } = await reportsQuery;
  const reportsList = reports ?? [];

  const reportsSearchParams: Record<string, string> = { tab: "reports" };
  if (rStatus !== "all") reportsSearchParams.status = rStatus;
  if (rType !== "all") reportsSearchParams.type = rType;
  if (params.from) reportsSearchParams.from = params.from;
  if (params.to) reportsSearchParams.to = params.to;
  reportsSearchParams.rsortBy = rSortBy;
  reportsSearchParams.rsortOrder = rSortOrder;
  reportsSearchParams.page = String(rpage);
  reportsSearchParams.pageSize = String(rpageSize);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Support</h1>
      <p className="mt-1 text-sm text-slate-400">
        <strong>Open ticket</strong> shows tickets that are open or in progress. <strong>Reports</strong> are complaints or issues submitted by users; each report can have a linked ticket for follow-up.
      </p>

      {/* Tabs */}
      <div className="mt-6 flex gap-1 rounded-lg border border-slate-600 bg-slate-800/80 p-0.5 w-fit">
        <Link
          href="/dashboard/support"
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "tickets"
              ? "bg-[var(--primary)] text-white"
              : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          Open ticket
        </Link>
        <Link
          href="/dashboard/support?tab=reports"
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "reports"
              ? "bg-[var(--primary)] text-white"
              : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          Reports
        </Link>
      </div>

      {tab === "tickets" ? (
        <div className="card mt-6 overflow-hidden">
          <div className="flex items-center justify-end gap-2 border-b border-slate-700/50 bg-slate-800/30 px-4 py-2">
            <TableRefreshButton />
          </div>
          <SupportTicketsTable tickets={tickets ?? []} sortBy={tSortBy} sortOrder={tSortOrder} basePath="/dashboard/support" searchParams={ticketsSearchParams} />
          <TablePagination
            basePath="/dashboard/support"
            searchParams={ticketsSearchParams}
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
          />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-4">
              <p className="text-xs font-medium uppercase text-slate-400">Total reports</p>
              <p className="mt-1 text-2xl font-semibold text-white">{reportsCount ?? 0}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-medium uppercase text-amber-400">Open</p>
              <p className="mt-1 text-2xl font-semibold text-amber-400">{openReports ?? 0}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-medium uppercase text-amber-400">In progress</p>
              <p className="mt-1 text-2xl font-semibold text-amber-400">{inProgressReports ?? 0}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Status</label>
              <div className="flex flex-wrap gap-0.5 rounded-lg border border-slate-600 bg-slate-800/80 p-0.5">
                {REPORT_STATUSES.map((s) => (
                  <Link
                    key={s}
                    href={`/dashboard/support?${new URLSearchParams({ ...reportsSearchParams, status: s, page: "1" }).toString()}`}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                      rStatus === s
                        ? "bg-[var(--primary)] text-white"
                        : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {s.replace("_", " ")}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Type</label>
              <div className="flex flex-wrap gap-0.5 rounded-lg border border-slate-600 bg-slate-800/80 p-0.5">
                {REPORT_TYPES.map((t) => (
                  <Link
                    key={t}
                    href={`/dashboard/support?${new URLSearchParams({ ...reportsSearchParams, type: t, page: "1" }).toString()}`}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                      rType === t
                        ? "bg-[var(--primary)] text-white"
                        : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {t.replace(/_/g, " ")}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="card mt-6 overflow-hidden">
            <div className="flex items-center justify-end gap-2 border-b border-slate-700/50 bg-slate-800/30 px-4 py-2">
              <TableRefreshButton />
            </div>
            <table className="table-sleek">
              <thead>
                <tr>
                  <SortableTh label="Type" sortKey="report_type" currentSortBy={rSortBy} currentSortOrder={rSortOrder} basePath="/dashboard/support" searchParams={reportsSearchParams} sortByParam="rsortBy" sortOrderParam="rsortOrder" />
                  <SortableTh label="Status" sortKey="status" currentSortBy={rSortBy} currentSortOrder={rSortOrder} basePath="/dashboard/support" searchParams={reportsSearchParams} sortByParam="rsortBy" sortOrderParam="rsortOrder" />
                  <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Description</th>
                  <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Ride</th>
                  <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Support ticket</th>
                  <SortableTh label="Created" sortKey="created_at" currentSortBy={rSortBy} currentSortOrder={rSortOrder} basePath="/dashboard/support" searchParams={reportsSearchParams} sortByParam="rsortBy" sortOrderParam="rsortOrder" />
                  <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportsList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No reports found.
                    </td>
                  </tr>
                ) : (
                  reportsList.map((r: any) => (
                    <tr key={r.id}>
                      <td><ReportTypeBadge type={r.report_type} /></td>
                      <td><ReportStatusBadge status={r.status} /></td>
                      <td className="max-w-xs truncate text-slate-300">{r.description}</td>
                      <td>
                        {r.ride_id ? (
                          <Link href={`/dashboard/rides/${r.ride_id}`} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline text-xs">
                            View
                          </Link>
                        ) : "—"}
                      </td>
                      <td>
                        {r.ticket_id ? (
                          <Link href={`/dashboard/support/${r.ticket_id}`} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline text-xs">
                            Open conversation
                          </Link>
                        ) : "—"}
                      </td>
                      <td className="text-slate-400 whitespace-nowrap">{formatDate(r.created_at)}</td>
                      <td className="text-right">
                        <Link href={`/dashboard/support/reports/${r.id}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[var(--primary)] hover:underline">
                          View report
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <TablePagination
              basePath="/dashboard/support"
              searchParams={reportsSearchParams}
              page={rpage}
              pageSize={rpageSize}
              totalCount={reportsCount ?? 0}
            />
          </div>
        </>
      )}
    </div>
  );
}
