"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const PAGE_SIZES = [10, 25, 50, 100] as const;

export interface TablePaginationProps {
  /** Base path e.g. "/dashboard/rides" */
  basePath: string;
  /** Current search params (excluding page/pageSize) so we preserve filters */
  searchParams: Record<string, string>;
  /** 1-based current page */
  page: number;
  pageSize: number;
  totalCount: number;
  /** Optional: show page size selector (updates URL) */
  showPageSize?: boolean;
  className?: string;
}

export function TablePagination({
  basePath,
  searchParams,
  page,
  pageSize,
  totalCount,
  showPageSize = true,
  className,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  function buildUrl(p: number, size?: number) {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set("page", String(p));
    params.set("pageSize", String(size ?? pageSize));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-slate-700/50 bg-slate-800/30 px-4 py-3",
        className
      )}
    >
      <p className="text-sm text-slate-400">
        Showing <span className="font-medium text-slate-200">{from}</span>–
        <span className="font-medium text-slate-200">{to}</span> of{" "}
        <span className="font-medium text-slate-200">{totalCount}</span>
      </p>
      <div className="flex items-center gap-2">
        {showPageSize && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Per page</span>
            <div className="flex rounded-lg border border-slate-600 bg-slate-800/80">
              {PAGE_SIZES.map((size) => (
                <Link
                  key={size}
                  href={buildUrl(1, size)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium transition-colors",
                    pageSize === size
                      ? "bg-[var(--primary)] text-white"
                      : "text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  )}
                >
                  {size}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Link
            href={buildUrl(Math.max(1, page - 1))}
            className={cn(
              "rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-1.5 text-sm font-medium transition-colors",
              page <= 1
                ? "pointer-events-none opacity-50"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            )}
            aria-disabled={page <= 1}
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
              page >= totalPages
                ? "pointer-events-none opacity-50"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            )}
            aria-disabled={page >= totalPages}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
