import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DriverAdminActions } from "./driver-admin-actions";
import { UserVerifiedDropdown } from "./user-verified-dropdown";
import { DriverVerificationDropdown } from "./driver-verification-dropdown";
import { ApproveVerificationButton } from "./approve-verification-button";
import { RiderDocumentsSection } from "./rider-documents-section";
import { VehicleDocumentsSection } from "./vehicle-documents-section";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: rider } = await supabaseAdmin
    .from("riders")
    .select(
      `
      *,
      users!inner ( id, full_name, phone, email, avatar_url, is_verified ),
      rider_documents ( id, document_type, document_url, verification_status ),
      vehicles ( id, vehicle_type, make, model, license_plate, color, vehicle_documents ( id, document_type, document_url, expiry_date, verification_status ) )
    `
    )
    .eq("id", id)
    .single();

  if (!rider) notFound();

  const user = (rider as any).users;

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setUTCDate(now.getUTCDate() - now.getUTCDay());
  startOfWeek.setUTCHours(0, 0, 0, 0);
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
  const endOfNow = new Date(now.getTime() + 60000);

  type IncomeStats = { total_requests?: number; total_trips?: number; completion_rate?: number; total_income?: number } | null;
  let statsWeek: IncomeStats = null;
  let statsMonth: IncomeStats = null;
  try {
    const [weekRes, monthRes] = await Promise.all([
      supabaseAdmin.rpc("fn_get_income_stats", {
        p_rider_id: rider.id,
        p_start_date: startOfWeek.toISOString(),
        p_end_date: endOfNow.toISOString(),
      }).maybeSingle(),
      supabaseAdmin.rpc("fn_get_income_stats", {
        p_rider_id: rider.id,
        p_start_date: startOfMonth.toISOString(),
        p_end_date: endOfNow.toISOString(),
      }).maybeSingle(),
    ]);
    statsWeek = weekRes.data as IncomeStats;
    statsMonth = monthRes.data as IncomeStats;
  } catch {
    // RPC may not exist before migration 006
  }
  const docs = (rider as any).rider_documents ?? [];
  const vehicles = (rider as any).vehicles ?? [];

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">

      {/* ── ZONE 1 · Identity (name + phone left, availability right) ── */}
      <Link
        href="/dashboard/users"
        className="mb-4 inline-block text-sm font-medium text-[var(--primary)] hover:opacity-90"
      >
        ← Back to Users
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            {user?.full_name ?? "—"}
          </h1>
          <p className="mt-0.5 text-sm text-slate-400">
            {user?.phone ?? user?.email ?? "—"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Badge</span>
            <UserVerifiedDropdown
              userId={user?.id ?? ""}
              isVerified={Boolean((user as any)?.is_verified)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Approve account</span>
            <DriverVerificationDropdown
              riderId={rider.id}
              verificationStatus={rider.verification_status}
            />
          </div>
          <ApproveVerificationButton
            riderId={rider.id}
            verificationStatus={rider.verification_status}
          />
        </div>
      </div>

      {/* ── ZONE 2 · At-a-glance stats ribbon ─────────── */}
      <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-700/60 bg-slate-700/40 sm:grid-cols-4">
        <StatCell label="Total trips" value={String(rider.total_completed_trips ?? 0)} />
        <StatCell
          label="Lifetime earnings"
          value={`৳${Number(rider.total_earnings ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        />
        <StatCell
          label="Rating"
          value={Number(rider.rating_average ?? 0).toFixed(1)}
        />
        <StatCell
          label="Unpaid"
          value={`৳${Number(rider.unpaid_amount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          alert={Number(rider.unpaid_amount ?? 0) > 0}
        />
      </div>

      {/* ── ZONE 3 · Admin Controls (single control center) ── */}
      <DriverAdminActions
        riderId={rider.id}
        userId={user?.id ?? ""}
        isActive={rider.is_active}
        isBlocked={rider.is_blocked}
        isOnline={Boolean((rider as any).is_online)}
        paymentTier={Number(rider.payment_tier ?? 0)}
        unpaidAmount={Number(rider.unpaid_amount ?? 0)}
        fullName={user?.full_name ?? ""}
        phone={user?.phone ?? ""}
      />

      {/* ── ZONE 4 · Rider Documents ─────────────────── */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Rider documents
        </h2>
        <RiderDocumentsSection docs={docs} />
      </section>

      {/* ── ZONE 5 · Vehicles & Vehicle Documents ─────── */}
      {vehicles.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
            Vehicles
          </h2>
          <VehicleDocumentsSection vehicles={vehicles} />
        </section>
      )}

      {/* ── ZONE 6 · Income Stats (least urgent) ─────── */}
      <section className="mt-8 mb-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Income stats
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <IncomeCard title="This week" stats={statsWeek} />
          <IncomeCard title="This month" stats={statsMonth} />
        </div>
      </section>
    </div>
  );
}

/* ────────────────── helper components ────────────────── */

function StatCell({
  label,
  value,
  alert,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className="bg-slate-800/70 px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        className={`mt-0.5 text-lg font-semibold tabular-nums ${
          alert ? "text-amber-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function IncomeCard({
  title,
  stats,
}: {
  title: string;
  stats: {
    total_requests?: number;
    total_trips?: number;
    completion_rate?: number;
    total_income?: number;
  } | null;
}) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </h3>
      {stats ? (
        <dl className="space-y-1.5 text-sm">
          <Row label="Requests" value={String(stats.total_requests ?? 0)} />
          <Row label="Trips" value={String(stats.total_trips ?? 0)} />
          <Row
            label="Completion"
            value={`${Number(stats.completion_rate ?? 0).toFixed(1)}%`}
          />
          <Row
            label="Income"
            value={`৳${Number(stats.total_income ?? 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            bold
          />
        </dl>
      ) : (
        <p className="text-sm text-slate-500">No data</p>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-400">{label}</dt>
      <dd className={bold ? "font-medium text-white" : "text-slate-200"}>
        {value}
      </dd>
    </div>
  );
}
