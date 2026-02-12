"use client";

import Link from "next/link";
import { CaretUp, CaretDown, CaretUpDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface SortableThProps {
  /** Column label */
  label: string;
  /** Sort key for this column (e.g. "created_at") */
  sortKey: string;
  /** Current sort column from URL */
  currentSortBy: string | null;
  /** Current order: "asc" | "desc" */
  currentSortOrder: "asc" | "desc";
  /** Base path e.g. "/dashboard/rides" */
  basePath: string;
  /** All current search params (filters, page, pageSize) so we preserve them */
  searchParams: Record<string, string>;
  /** Alignment: default left, "right" for number columns */
  align?: "left" | "right";
  /** URL param names when different from sortBy/sortOrder (e.g. reports use rsortBy/rsortOrder) */
  sortByParam?: string;
  sortOrderParam?: string;
  className?: string;
}

export function SortableTh({
  label,
  sortKey,
  currentSortBy,
  currentSortOrder,
  basePath,
  searchParams,
  align = "left",
  sortByParam = "sortBy",
  sortOrderParam = "sortOrder",
  className,
}: SortableThProps) {
  const isActive = currentSortBy === sortKey;
  const nextOrder =
    isActive && currentSortOrder === "desc" ? "asc" : "desc";

  const params = new URLSearchParams(searchParams as Record<string, string>);
  params.set(sortByParam, sortKey);
  params.set(sortOrderParam, nextOrder);
  params.set("page", "1"); // reset to first page when changing sort
  const href = `${basePath}?${params.toString()}`;

  return (
    <th
      className={cn(
        "border-b border-slate-700/80 bg-slate-800/80 px-4 py-3 font-medium text-slate-300",
        align === "right" && "text-right",
        className
      )}
    >
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 hover:text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
      >
        <span>{label}</span>
        {isActive ? (
          currentSortOrder === "desc" ? (
            <CaretDown size={14} weight="bold" className="opacity-80" />
          ) : (
            <CaretUp size={14} weight="bold" className="opacity-80" />
          )
        ) : (
          <CaretUpDown size={14} weight="bold" className="opacity-50" />
        )}
      </Link>
    </th>
  );
}
