import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format-date";
import { RideAdminActions } from "./ride-admin-actions";

function StatusBadge({ status }: { status: string }) {
  const className = status === "completed" ? "badge-success" : status === "cancelled" ? "badge-danger" : "badge-warning";
  return <span className={className}>{status}</span>;
}

export default async function RideDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: ride } = await supabaseAdmin
    .from("rides")
    .select("*")
    .eq("id", id)
    .single();

  if (!ride) notFound();

  const sections = [
    {
      title: "Route",
      rows: [
        ["Pickup", ride.pickup_address],
        ["Dropoff", ride.dropoff_address],
        ["Distance", `${ride.estimated_distance_km ?? "—"} km`],
        ["Duration", `${ride.estimated_duration_minutes ?? "—"} min`],
      ],
    },
    {
      title: "Fare",
      rows: [
        ["Base", `৳${Number(ride.base_fare ?? 0).toFixed(2)}`],
        ["Distance", `৳${Number(ride.distance_fare ?? 0).toFixed(2)}`],
        ["Time", `৳${Number(ride.time_fare ?? 0).toFixed(2)}`],
        ["Surge (multiplier)", `${ride.surge_multiplier ?? 1}x`],
        ["Surge amount", `৳${Number("surge_amount" in ride ? (ride as { surge_amount: number }).surge_amount : 0).toFixed(2)}`],
        ["Discount", `-৳${Number(ride.discount_amount ?? 0).toFixed(2)}`],
        ["Final fare", `৳${Number(ride.final_fare ?? 0).toFixed(2)}`],
      ],
    },
    {
      title: "Status & timestamps",
      rows: [
        ["Status", ride.status],
        ["Payment", ride.payment_status ?? "—"],
        ["Requested", formatDateTime(ride.requested_at)],
        ["Started", formatDateTime(ride.started_at)],
        ["Completed", formatDateTime(ride.completed_at)],
        ["Cancelled", formatDateTime(ride.cancelled_at)],
        ["OTP", ride.otp_code ?? "—"],
      ],
    },
  ];

  return (
    <div className="p-8">
      <Link href="/dashboard/rides" className="mb-6 inline-block text-sm font-medium text-[var(--primary)] hover:opacity-90">
        ← Back to Rides
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight text-white">Ride {ride.id.slice(0, 8)}…</h1>
      <p className="mt-1 text-sm text-slate-400">{ride.ride_type} · <StatusBadge status={ride.status} /></p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <div key={section.title} className="card p-5">
            <h2 className="mb-4 font-semibold text-white">{section.title}</h2>
            <dl className="space-y-2 text-sm">
              {section.rows.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-slate-400">{label}</dt>
                  <dd className="text-right text-slate-200">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      {(ride.cancellation_reason || ride.cancelled_by) && (
        <div className="card mt-6 border-amber-600/50 bg-amber-950/40 p-5">
          <h2 className="mb-2 font-semibold text-amber-200">Cancellation</h2>
          <p className="text-sm text-amber-300">By: {ride.cancelled_by ?? "—"} · {ride.cancellation_reason ?? "—"}</p>
        </div>
      )}
      <RideAdminActions rideId={ride.id} currentStatus={ride.status} />
    </div>
  );
}
