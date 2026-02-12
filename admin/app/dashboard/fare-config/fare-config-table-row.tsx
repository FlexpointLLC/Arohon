"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const yes = (v: unknown) => v === true || v === "true";

type Row = {
  id: string;
  vehicle_type: string;
  base_fare: number | null;
  per_km_rate: number | null;
  per_minute_rate: number | null;
  minimum_fare: number | null;
  surge_enabled?: boolean;
  discount_enabled?: boolean;
  promo_enabled?: boolean;
  is_active?: boolean;
};

export function FareConfigTableRow({ row }: { row: Row }) {
  const router = useRouter();
  const editHref = `/dashboard/fare-config/${row.id}/edit`;

  return (
    <tr
      role="button"
      tabIndex={0}
      className="cursor-pointer transition-colors hover:bg-slate-800/50 focus:bg-slate-800/50 focus:outline-none"
      onClick={() => router.push(editHref)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(editHref);
        }
      }}
    >
      <td className="font-medium capitalize text-slate-200">{row.vehicle_type}</td>
      <td className="text-right text-slate-300">{Number(row.base_fare ?? 0).toFixed(2)}</td>
      <td className="text-right text-slate-300">{Number(row.per_km_rate ?? 0).toFixed(2)}</td>
      <td className="text-right text-slate-300">{Number(row.per_minute_rate ?? 0).toFixed(2)}</td>
      <td className="text-right text-slate-300">{Number(row.minimum_fare ?? 0).toFixed(2)}</td>
      <td>
        <span className={yes(row.surge_enabled) ? "badge-success" : "badge-danger"}>
          {yes(row.surge_enabled) ? "Yes" : "No"}
        </span>
      </td>
      <td>
        <span className={yes(row.discount_enabled) ? "badge-success" : "badge-danger"}>
          {yes(row.discount_enabled) ? "Yes" : "No"}
        </span>
      </td>
      <td>
        <span className={yes(row.promo_enabled) ? "badge-success" : "badge-danger"}>
          {yes(row.promo_enabled) ? "Yes" : "No"}
        </span>
      </td>
      <td>
        <span className={yes(row.is_active) ? "badge-success" : "badge-danger"}>
          {yes(row.is_active) ? "Yes" : "No"}
        </span>
      </td>
      <td className="text-right" onClick={(e) => e.stopPropagation()}>
        <Link
          href={editHref}
          className="text-sm font-medium text-[var(--primary)] hover:underline"
        >
          Edit
        </Link>
      </td>
    </tr>
  );
}
