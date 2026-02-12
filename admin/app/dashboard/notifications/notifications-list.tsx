"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SelectNative } from "@/components/ui/select-native";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableRefreshButton } from "@/components/ui/table-refresh-button";
import { formatDateTime } from "@/lib/format-date";
import { cn } from "@/lib/utils";

type Notif = {
  id: string;
  user_id: string | null;
  title: string;
  body: string;
  notification_type: string;
  created_at: string;
};

const PAGE_SIZES = [10, 25, 50, 100] as const;

export function NotificationsList() {
  const searchParams = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(10, parseInt(searchParams.get("pageSize") ?? "25", 10) || 25));

  const [list, setList] = useState<Notif[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(() => {
    setLoading(true);
    const offset = (page - 1) * pageSize;
    fetch(`/api/notifications?limit=${pageSize}&offset=${offset}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.data && Array.isArray(res.data)) {
          setList(res.data);
          setTotal(res.total ?? 0);
        } else {
          setList([]);
          setTotal(0);
        }
      })
      .catch(() => {
        setList([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [page, pageSize]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  function buildUrl(p: number, size?: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    params.set("pageSize", String(size ?? pageSize));
    return `/dashboard/notifications/list?${params.toString()}`;
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this notification? This cannot be undone.")) return;
    const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
    if (res.ok) fetchList();
    else window.alert((await res.json().catch(() => ({}))).error ?? "Failed to delete");
  }

  if (loading && list.length === 0) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <>
      <div className="flex items-center justify-end gap-2 border-b border-slate-700/50 bg-slate-800/30 px-4 py-2 mb-0 rounded-t-lg">
        <TableRefreshButton onRefresh={fetchList} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Body</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>User ID</TableHead>
            <TableHead className="text-right">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                No notifications sent yet.
              </TableCell>
            </TableRow>
          ) : (
            list.map((n) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium">{n.title}</TableCell>
                <TableCell className="max-w-xs truncate text-muted-foreground">{n.body}</TableCell>
                <TableCell className="text-muted-foreground">{n.notification_type ?? "—"}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{n.user_id ?? "broadcast"}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatDateTime(n.created_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/notifications/${n.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(n.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-700/50 bg-slate-800/30 px-4 py-3">
        <p className="text-sm text-slate-400">
          Showing <span className="font-medium text-slate-200">{from}</span>–
          <span className="font-medium text-slate-200">{to}</span> of{" "}
          <span className="font-medium text-slate-200">{total}</span>
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Per page</span>
            <div className="flex rounded-lg border border-slate-600 bg-slate-800/80">
              {PAGE_SIZES.map((size) => (
                <Link
                  key={size}
                  href={buildUrl(1, size)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium transition-colors",
                    pageSize === size ? "bg-[var(--primary)] text-white" : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  )}
                >
                  {size}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href={buildUrl(Math.max(1, page - 1))}
              className={cn(
                "rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-1.5 text-sm font-medium transition-colors",
                page <= 1 ? "pointer-events-none opacity-50" : "text-slate-300 hover:bg-slate-700 hover:text-white"
              )}
            >
              Previous
            </Link>
            <span className="px-2 text-sm text-slate-400">
              Page {page} of {totalPages}
            </span>
            <Link
              href={buildUrl(Math.min(totalPages, page + 1))}
              className={cn(
                "rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-1.5 text-sm font-medium transition-colors",
                page >= totalPages ? "pointer-events-none opacity-50" : "text-slate-300 hover:bg-slate-700 hover:text-white"
              )}
            >
              Next
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
