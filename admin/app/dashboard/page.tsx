import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";
import { TableRefreshButton } from "@/components/ui/table-refresh-button";
import { formatDateTime } from "@/lib/format-date";
import {
  Car,
  Users,
  Wallet,
  ChatCircle,
  ShieldCheck,
} from "@phosphor-icons/react/ssr";

async function getStats() {
  try {
    const [
      { count: ridesToday },
      { count: totalRiders },
      { count: onlineRiders },
      { count: pendingPayments },
      { count: pendingVerification },
      { count: openTickets },
    ] = await Promise.all([
      supabaseAdmin
        .from("rides")
        .select("id", { count: "exact", head: true })
        .gte("created_at", new Date().toISOString().slice(0, 10)),
      supabaseAdmin.from("riders").select("id", { count: "exact", head: true }),
      supabaseAdmin
        .from("riders")
        .select("id", { count: "exact", head: true })
        .eq("is_online", true),
      supabaseAdmin
        .from("payment_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabaseAdmin
        .from("riders")
        .select("id", { count: "exact", head: true })
        .eq("verification_status", "pending"),
      supabaseAdmin
        .from("support_tickets")
        .select("id", { count: "exact", head: true })
        .in("status", ["open", "in_progress"]),
    ]);

    return {
      ridesToday: ridesToday ?? 0,
      totalRiders: totalRiders ?? 0,
      onlineRiders: onlineRiders ?? 0,
      pendingPayments: pendingPayments ?? 0,
      pendingVerification: pendingVerification ?? 0,
      openTickets: openTickets ?? 0,
    };
  } catch {
    return {
      ridesToday: 0,
      totalRiders: 0,
      onlineRiders: 0,
      pendingPayments: 0,
      pendingVerification: 0,
      openTickets: 0,
    };
  }
}

async function getRecentRides() {
  try {
    const { data } = await supabaseAdmin
      .from("rides")
      .select(
        "id, status, final_fare, pickup_address, dropoff_address, created_at, ride_type"
      )
      .order("created_at", { ascending: false })
      .limit(10);
    return data ?? [];
  } catch {
    return [];
  }
}

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "completed"
      ? "badge-success"
      : status === "cancelled"
        ? "badge-danger"
        : "badge-warning";
  return <span className={className}>{status}</span>;
}

export default async function DashboardPage() {
  const [stats, recentRides] = await Promise.all([getStats(), getRecentRides()]);

  const cards = [
    {
      label: "Rides today",
      value: stats.ridesToday,
      icon: Car,
      href: "/dashboard/rides",
    },
    {
      label: "Total drivers",
      value: stats.totalRiders,
      sub: `${stats.onlineRiders} online`,
      icon: Users,
      href: "/dashboard/users",
    },
    {
      label: "Pending payment requests",
      value: stats.pendingPayments,
      icon: Wallet,
      href: "/dashboard/payments",
    },
    {
      label: "Pending verification",
      value: stats.pendingVerification,
      icon: ShieldCheck,
      href: "/dashboard/verification",
    },
    {
      label: "Open support tickets",
      value: stats.openTickets,
      icon: ChatCircle,
      href: "/dashboard/support",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Overview of your ride-hailing operations
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card-hover block p-5">
            <c.icon className="mb-2 text-[var(--primary)]" size={28} />
            <p className="text-2xl font-semibold text-white">{c.value}</p>
            <p className="text-sm text-slate-400">{c.label}</p>
            {c.sub && <p className="mt-0.5 text-xs text-slate-500">{c.sub}</p>}
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-white">Recent rides</h2>
        <p className="mt-0.5 text-sm text-slate-400">Latest ride activity</p>
        <div className="card mt-4 overflow-hidden">
          <div className="flex items-center justify-end gap-2 border-b border-slate-700/50 bg-slate-800/30 px-4 py-2">
            <TableRefreshButton />
          </div>
          <table className="table-sleek">
            <thead>
              <tr>
                <th>ID / Route</th>
                <th>Type</th>
                <th>Status</th>
                <th className="text-right">Fare</th>
                <th className="text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentRides.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No rides yet
                  </td>
                </tr>
              ) : (
                recentRides.map((ride) => (
                  <tr key={ride.id}>
                    <td>
                      <Link
                        href={`/dashboard/rides/${ride.id}`}
                        className="font-mono text-xs text-[var(--primary)] hover:underline"
                      >
                        {ride.id.slice(0, 8)}…
                      </Link>
                      <p className="max-w-[200px] truncate text-slate-400">
                        {ride.pickup_address} → {ride.dropoff_address}
                      </p>
                    </td>
                    <td className="capitalize text-slate-200">
                      {ride.ride_type}
                    </td>
                    <td>
                      <StatusBadge status={ride.status} />
                    </td>
                    <td className="text-right font-medium text-slate-200">
                      ৳{Number(ride.final_fare ?? 0).toFixed(0)}
                    </td>
                    <td className="text-right text-slate-400">
                      {formatDateTime(ride.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Link
          href="/dashboard/rides"
          className="mt-4 inline-block text-sm font-medium text-[var(--primary)] hover:opacity-90"
        >
          View all rides →
        </Link>
      </section>
    </div>
  );
}
