"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SelectNative } from "@/components/ui/select-native";
import { SortableTh } from "@/components/ui/sortable-th";

// Must match DB CHECK constraint: riders_verification_status_check
const VERIFICATION_STATUSES = ["pending", "approved", "rejected", "suspended"] as const;

type Rider = {
  id: string;
  user_id: string;
  verification_status: string;
  is_active: boolean;
  is_blocked: boolean | null;
  payment_tier: number | null;
  unpaid_amount: number | null;
  total_completed_trips: number | null;
  total_earnings: number | null;
  users: {
    id: string;
    full_name: string | null;
    phone: string | null;
    email: string | null;
  };
};

type SortableProps = { sortBy: string | null; sortOrder: "asc" | "desc"; basePath: string; searchParams: Record<string, string> };

export function UsersTable({
  list,
  sortBy = null,
  sortOrder = "desc",
  basePath = "/dashboard/users",
  searchParams = {},
}: { list: Rider[] } & Partial<SortableProps>) {
  const router = useRouter();
  const [updating, setUpdating] = useState<{ id: string; field: string } | null>(null);

  async function patchRider(id: string, updates: Record<string, unknown>, field: string) {
    setUpdating({ id, field });
    try {
      const res = await fetch(`/api/riders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to update ${field}: ${data.error ?? res.statusText}`);
        return;
      }
    } catch (err) {
      alert(`Network error: ${err instanceof Error ? err.message : "Unknown error"}`);
      return;
    } finally {
      setUpdating(null);
    }
    router.refresh();
  }

  return (
    <table className="table-sleek">
      <thead>
        <tr>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Name</th>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Phone</th>
          {sortBy != null ? (
            <SortableTh label="Verification" sortKey="verification_status" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Verification</th>
          )}
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Active</th>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300">Blocked</th>
          <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Tier / Unpaid</th>
          {sortBy != null ? (
            <SortableTh label="Trips" sortKey="total_completed_trips" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} align="right" />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Trips</th>
          )}
          {sortBy != null ? (
            <SortableTh label="Earnings" sortKey="total_earnings" currentSortBy={sortBy} currentSortOrder={sortOrder} basePath={basePath} searchParams={searchParams} align="right" />
          ) : (
            <th className="border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300 text-right">Earnings</th>
          )}
        </tr>
      </thead>
      <tbody>
        {list.length === 0 ? (
          <tr>
            <td colSpan={8} className="py-12 text-center text-slate-400">
              No drivers found
            </td>
          </tr>
        ) : (
          list.map((r) => (
            <tr key={r.id}>
              <td>
                <Link href={`/dashboard/users/${r.id}`} className="font-medium text-[var(--primary)] hover:underline">
                  {r.users?.full_name ?? "—"}
                </Link>
              </td>
              <td className="text-slate-400">{r.users?.phone ?? "—"}</td>
              <td>
                <SelectNative
                  value={r.verification_status}
                  onChange={(e) =>
                    patchRider(r.id, { verification_status: e.target.value }, "verification_status")
                  }
                  disabled={updating?.id === r.id}
                  loading={updating?.id === r.id && updating?.field === "verification_status"}
                  className="min-w-[100px] capitalize"
                  options={VERIFICATION_STATUSES.map((s) => ({ value: s, label: s }))}
                  variantByValue={{ pending: "warning", approved: "success", rejected: "danger", suspended: "danger" }}
                />
              </td>
              <td>
                <SelectNative
                  value={r.is_active ? "yes" : "no"}
                  onChange={(e) =>
                    patchRider(r.id, { is_active: e.target.value === "yes" }, "is_active")
                  }
                  disabled={updating?.id === r.id}
                  loading={updating?.id === r.id && updating?.field === "is_active"}
                  className="min-w-[80px]"
                  options={[
                    { value: "yes", label: "Active" },
                    { value: "no", label: "Inactive" },
                  ]}
                  variantByValue={{ yes: "success", no: "neutral" }}
                />
              </td>
              <td>
                <div className="w-[100px] max-w-full">
                  <SelectNative
                    value={r.is_blocked ? "yes" : "no"}
                    onChange={(e) =>
                      patchRider(r.id, { is_blocked: e.target.value === "yes" }, "is_blocked")
                    }
                    disabled={updating?.id === r.id}
                    loading={updating?.id === r.id && updating?.field === "is_blocked"}
                    className="w-full"
                    options={[
                      { value: "no", label: "No" },
                      { value: "yes", label: "Blocked" },
                    ]}
                    variantByValue={{ no: "success", yes: "danger" }}
                  />
                </div>
              </td>
              <td className="text-right text-slate-200">
                Tier {r.payment_tier ?? 0} · ৳
                {Number(r.unpaid_amount ?? 0).toFixed(0)}
              </td>
              <td className="text-right text-slate-200">{r.total_completed_trips ?? 0}</td>
              <td className="text-right text-slate-200">
                ৳{Number(r.total_earnings ?? 0).toFixed(0)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
