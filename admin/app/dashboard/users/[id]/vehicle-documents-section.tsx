"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SelectNative } from "@/components/ui/select-native";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

type VehicleDoc = {
  id: string;
  document_type: string;
  document_url: string | null;
  expiry_date: string | null;
  verification_status: string;
};

type Vehicle = {
  id: string;
  vehicle_type: string;
  make: string;
  model: string;
  license_plate: string;
  color: string | null;
  vehicle_documents: VehicleDoc[];
};

export function VehicleDocumentsSection({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const [savingDocId, setSavingDocId] = useState<string | null>(null);
  const [savingExpiryId, setSavingExpiryId] = useState<string | null>(null);

  async function onStatusChange(docId: string, value: string) {
    setSavingDocId(docId);
    const res = await fetch(`/api/vehicle-documents/${docId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verification_status: value }),
    });
    setSavingDocId(null);
    if (res.ok) router.refresh();
  }

  async function onExpiryChange(docId: string, value: string) {
    setSavingExpiryId(docId);
    const payload: { expiry_date: string | null } = value ? { expiry_date: value } : { expiry_date: null };
    const res = await fetch(`/api/vehicle-documents/${docId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSavingExpiryId(null);
    if (res.ok) router.refresh();
  }

  async function handleExpiryBlur(docId: string, currentValue: string, inputValue: string) {
    const trimmed = inputValue.trim();
    if (trimmed === currentValue) return;
    await onExpiryChange(docId, trimmed);
  }

  if (vehicles.length === 0) return null;

  return (
    <div className="space-y-4">
      {vehicles.map((v) => {
        const vdocs = v.vehicle_documents ?? [];
        return (
          <div key={v.id} className="card p-6">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="font-medium capitalize text-white">{v.vehicle_type}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">{v.make} {v.model}</span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-sm text-slate-300">{v.license_plate}</span>
              {v.color && <span className="text-xs text-slate-500">({v.color})</span>}
            </div>
            {vdocs.length === 0 ? (
              <p className="text-sm text-slate-500">No vehicle documents uploaded.</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-slate-700/50">
                <table className="table-sleek">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Status</th>
                      <th>Expiry</th>
                      <th className="text-right">File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vdocs.map((d) => {
                      const isExpired = d.expiry_date && new Date(d.expiry_date) < new Date();
                      const expiringSoon =
                        d.expiry_date &&
                        !isExpired &&
                        new Date(d.expiry_date) < new Date(Date.now() + 30 * 86400000);
                      return (
                        <tr key={d.id}>
                          <td className="capitalize text-slate-200">
                            {String(d.document_type).replace(/_/g, " ")}
                          </td>
                          <td>
                            <SelectNative
                              value={d.verification_status}
                              onChange={(e) => onStatusChange(d.id, e.target.value)}
                              options={STATUS_OPTIONS}
                              variantByValue={{
                                pending: "warning",
                                approved: "success",
                                rejected: "danger",
                              }}
                              loading={savingDocId === d.id}
                              disabled={savingDocId === d.id}
                              className="w-32"
                            />
                          </td>
                          <td>
                            <div className="relative inline-block">
                              <input
                                type="date"
                                defaultValue={d.expiry_date ?? ""}
                                onBlur={(e) => handleExpiryBlur(d.id, d.expiry_date ?? "", e.target.value)}
                                disabled={savingExpiryId === d.id}
                                className={`min-w-[10rem] rounded border bg-slate-800/80 px-2 py-1 text-sm text-slate-200 focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/30 disabled:opacity-50 [color-scheme:dark] ${
                                  isExpired ? "border-red-500/50 text-red-400" : expiringSoon ? "border-amber-500/50 text-amber-400" : "border-slate-600"
                                }`}
                              />
                              {savingExpiryId === d.id && (
                                <span
                                  className="pointer-events-none absolute right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded bg-slate-800/95 text-slate-300"
                                  aria-hidden
                                >
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                </span>
                              )}
                            </div>
                            {isExpired && <span className="ml-1 text-xs text-red-400">expired</span>}
                            {expiringSoon && !isExpired && <span className="ml-1 text-xs text-amber-400">soon</span>}
                          </td>
                          <td className="text-right">
                            {d.document_url ? (
                              <a
                                href={d.document_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[var(--primary)] hover:underline"
                              >
                                View
                              </a>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
