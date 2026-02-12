import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format-date";
import { ReportActions } from "./report-actions";
import { ReportStatusDropdown } from "./report-status-dropdown";

function TypeBadge({ type }: { type: string }) {
  const cls =
    type === "safety_concern"
      ? "badge-danger"
      : type === "driver_behavior" || type === "vehicle_issue"
        ? "badge-warning"
        : "badge-success";
  return <span className={cls}>{type.replace(/_/g, " ")}</span>;
}

export default async function SupportReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: report } = await supabaseAdmin
    .from("reports")
    .select("*")
    .eq("id", id)
    .single();

  if (!report) notFound();

  const { data: reporter } = await supabaseAdmin
    .from("users")
    .select("full_name, phone")
    .eq("id", report.reported_by_user_id)
    .single();

  const { data: reportedUser } = report.reported_user_id
    ? await supabaseAdmin
        .from("users")
        .select("full_name, phone")
        .eq("id", report.reported_user_id)
        .single()
    : { data: null };

  const { data: resolver } = report.resolved_by
    ? await supabaseAdmin
        .from("users")
        .select("full_name")
        .eq("id", report.resolved_by)
        .single()
    : { data: null };

  return (
    <div className="p-8">
      <Link
        href="/dashboard/support?tab=reports"
        className="mb-6 inline-block text-sm font-medium text-[var(--primary)] hover:opacity-90"
      >
        Back to Support (Reports)
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-white">Report</h1>
          <TypeBadge type={report.report_type} />
        </div>
        <ReportStatusDropdown reportId={report.id} currentStatus={report.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-white">Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Reporter</dt>
              <dd className="text-slate-200">{reporter?.full_name ?? reporter?.phone ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Reported user</dt>
              <dd className="text-slate-200">{reportedUser?.full_name ?? reportedUser?.phone ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Ride</dt>
              <dd>
                {report.ride_id ? (
                  <Link href={`/dashboard/rides/${report.ride_id}`} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">
                    View ride
                  </Link>
                ) : (
                  <span className="text-slate-500">-</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Support ticket</dt>
              <dd>
                {report.ticket_id ? (
                  <Link href={`/dashboard/support/${report.ticket_id}`} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">
                    Open conversation
                  </Link>
                ) : (
                  <span className="text-slate-500">-</span>
                )}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Created</dt>
              <dd className="text-slate-200">{formatDateTime(report.created_at)}</dd>
            </div>
          </dl>
          <div className="mt-4 rounded-lg bg-slate-700/30 p-3">
            <p className="text-xs font-medium text-slate-400 mb-1">Description</p>
            <p className="text-sm text-slate-200 whitespace-pre-wrap">{report.description}</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-white">Resolution</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Resolved by</dt>
              <dd className="text-slate-200">{resolver?.full_name ?? "-"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Resolved at</dt>
              <dd className="text-slate-200">
                {report.resolved_at ? formatDateTime(report.resolved_at) : "-"}
              </dd>
            </div>
          </dl>
          {report.admin_notes && (
            <div className="mt-4 rounded-lg bg-slate-700/30 p-3">
              <p className="text-xs font-medium text-slate-400 mb-1">Admin notes</p>
              <p className="text-sm text-slate-200 whitespace-pre-wrap">{report.admin_notes}</p>
            </div>
          )}
          <div className="mt-6 border-t border-slate-700/50 pt-4">
            <ReportActions
              reportId={report.id}
              currentStatus={report.status}
              currentNotes={report.admin_notes ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
