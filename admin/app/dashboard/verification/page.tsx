import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { TableRefreshButton } from "@/components/ui/table-refresh-button";
import { SortableTh } from "@/components/ui/sortable-th";
import { formatDateTime } from "@/lib/format-date";

export default async function VerificationPage({
  searchParams,
}: {
  searchParams: Promise<{ sortBy?: string; sortOrder?: string }>;
}) {
  const params = await searchParams;
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  const { data: riders } = await supabaseAdmin
    .from("riders")
    .select(
      `
      id,
      verification_status,
      verification_reason,
      created_at,
      users!inner ( full_name, phone )
    `
    )
    .eq("verification_status", "pending")
    .order("created_at", { ascending: sortOrder === "asc" });

  const list = (riders ?? []) as unknown as Array<{
    id: string;
    verification_status: string;
    verification_reason: string | null;
    created_at: string;
    users: { full_name: string | null; phone: string | null };
  }>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Verification queue</h1>
      <p className="mt-1 text-sm text-slate-400">
        Drivers with pending verification. Approve or reject from their profile.
      </p>
      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-end gap-2 border-b border-slate-700/50 bg-slate-800/30 px-4 py-2">
          <TableRefreshButton />
        </div>
        <table className="table-sleek">
          <thead>
            <tr>
              <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Name</th>
              <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Phone</th>
              <SortableTh label="Submitted" sortKey="created_at" currentSortBy="created_at" currentSortOrder={sortOrder} basePath="/dashboard/verification" searchParams={{ sortBy: "created_at", sortOrder }} align="right" />
              <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  No pending verifications
                </td>
              </tr>
            ) : (
              list.map((r) => (
                <tr key={r.id}>
                  <td className="font-medium text-slate-200">{r.users?.full_name ?? "—"}</td>
                  <td className="text-slate-400">{r.users?.phone ?? "—"}</td>
                  <td className="text-right text-slate-400">
                    {formatDateTime(r.created_at)}
                  </td>
                  <td className="text-right">
                    <Link href={`/dashboard/users/${r.id}`} className="text-[var(--primary)] hover:underline">
                      View & verify
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
