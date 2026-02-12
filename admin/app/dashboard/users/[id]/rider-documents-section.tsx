"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectNative } from "@/components/ui/select-native";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

type Doc = {
  id: string;
  document_type: string;
  document_url: string | null;
  verification_status: string;
};

export function RiderDocumentsSection({ docs }: { docs: Doc[] }) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);

  async function onStatusChange(docId: string, value: string) {
    setSavingId(docId);
    const res = await fetch(`/api/rider-documents/${docId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verification_status: value }),
    });
    setSavingId(null);
    if (res.ok) router.refresh();
  }

  async function onApprove(docId: string) {
    setSavingId(docId);
    const res = await fetch(`/api/rider-documents/${docId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verification_status: "approved" }),
    });
    setSavingId(null);
    if (res.ok) router.refresh();
  }

  async function onReject(docId: string) {
    setSavingId(docId);
    const res = await fetch(`/api/rider-documents/${docId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verification_status: "rejected" }),
    });
    setSavingId(null);
    if (res.ok) router.refresh();
  }

  if (docs.length === 0) {
    return <p className="text-sm text-slate-400">No documents.</p>;
  }

  return (
    <ul className="space-y-3 text-sm">
      {docs.map((d) => (
        <li key={d.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2">
          <span className="font-medium capitalize text-slate-200">
            {String(d.document_type).replace(/_/g, " ")}
          </span>
          {d.document_url ? (
            <a
              href={d.document_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] hover:underline"
            >
              View
            </a>
          ) : (
            <span className="text-slate-500">—</span>
          )}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <SelectNative
              value={d.verification_status}
              onChange={(e) => onStatusChange(d.id, e.target.value)}
              options={STATUS_OPTIONS}
              variantByValue={{
                pending: "warning",
                approved: "success",
                rejected: "danger",
              }}
              loading={savingId === d.id}
              disabled={savingId === d.id}
              className="w-32"
            />
            {d.verification_status === "pending" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => onReject(d.id)}
                  disabled={savingId === d.id}
                  title="Reject"
                  className="h-8 w-8 shrink-0 rounded-[8px] border-red-500/50 bg-red-500/20 hover:bg-red-500/30"
                >
                  <X className="h-4 w-4 text-red-500" strokeWidth={2.5} />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onApprove(d.id)}
                  disabled={savingId === d.id}
                >
                  {savingId === d.id ? "Approving…" : "Approve"}
                </Button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
