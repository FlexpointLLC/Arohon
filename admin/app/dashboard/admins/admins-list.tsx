"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type AdminRow = {
  id: string;
  user_id: string;
  role: string;
  is_active: boolean;
  created_at: string;
  users: { id: string; email: string | null; full_name: string | null } | null;
};

export function AdminsList({ initialAdmins }: { initialAdmins: AdminRow[] }) {
  const router = useRouter();
  const [admins, setAdmins] = useState(initialAdmins);
  const [saving, setSaving] = useState<string | null>(null);

  async function setActive(id: string, isActive: boolean) {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: isActive }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(`Failed to update admin: ${data.error ?? res.statusText}`);
        return;
      }
    } catch (err) {
      alert(`Network error: ${err instanceof Error ? err.message : "Unknown error"}`);
      return;
    } finally {
      setSaving(null);
    }
    setAdmins((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_active: isActive } : a))
    );
    router.refresh();
  }

  if (admins.length === 0) return <p className="p-4 text-sm text-slate-400">No admin users.</p>;

  return (
    <table className="table-sleek">
      <thead>
        <tr>
          <th>Name / Email</th>
          <th>Role</th>
          <th>Active</th>
          <th className="text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {admins.map((a) => (
          <tr key={a.id}>
            <td>
              <span className="font-medium text-slate-200">{a.users?.full_name ?? "—"}</span>
              <span className="ml-2 text-slate-400">{a.users?.email ?? "—"}</span>
            </td>
            <td className="text-slate-200">{a.role}</td>
            <td className={a.is_active ? "text-emerald-400" : "text-slate-400"}>{a.is_active ? "Yes" : "No"}</td>
            <td className="text-right">
              {a.is_active ? (
                <Button type="button" variant="outline" size="sm" onClick={() => setActive(a.id, false)} disabled={saving === a.id}>
                  {saving === a.id ? "…" : "Deactivate"}
                </Button>
              ) : (
                <Button type="button" variant="outline" size="sm" onClick={() => setActive(a.id, true)} disabled={saving === a.id}>
                  {saving === a.id ? "…" : "Activate"}
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
