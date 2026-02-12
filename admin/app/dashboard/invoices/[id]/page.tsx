import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/format-date";

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "paid"
      ? "badge-success"
      : status === "cancelled"
        ? "badge-danger"
        : "badge-warning";
  return <span className={cls}>{status}</span>;
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: invoice } = await supabaseAdmin
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (!invoice) notFound();

  // Fetch customer and rider names
  const { data: customer } = await supabaseAdmin
    .from("users")
    .select("full_name, phone")
    .eq("id", invoice.customer_id)
    .single();

  const { data: riderRow } = invoice.rider_id
    ? await supabaseAdmin
        .from("riders")
        .select("users!inner(full_name, phone)")
        .eq("id", invoice.rider_id)
        .single()
    : { data: null };

  const riderUser = (riderRow as any)?.users;

  const fareRows: [string, string][] = [
    ["Base fare", `৳${Number(invoice.base_fare ?? 0).toFixed(2)}`],
    ["Distance fare", `৳${Number(invoice.distance_fare ?? 0).toFixed(2)}`],
    ["Time fare", `৳${Number(invoice.time_fare ?? 0).toFixed(2)}`],
    ["Surge amount", `৳${Number(invoice.surge_amount ?? 0).toFixed(2)}`],
    ["Discount", `-৳${Number(invoice.discount_amount ?? 0).toFixed(2)}`],
    ["Cancellation fee", `৳${Number(invoice.cancellation_fee ?? 0).toFixed(2)}`],
  ];

  return (
    <div className="p-8">
      <Link
        href="/dashboard/invoices"
        className="mb-6 inline-block text-sm font-medium text-[var(--primary)] hover:opacity-90"
      >
        ← Back to Invoices
      </Link>

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {invoice.invoice_number}
        </h1>
        <StatusBadge status={invoice.payment_status ?? "pending"} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* fare breakdown */}
        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-white">Fare breakdown</h2>
          <dl className="space-y-2 text-sm">
            {fareRows.map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-slate-400">{label}</dt>
                <dd className="text-slate-200">{value}</dd>
              </div>
            ))}
            <div className="border-t border-slate-700/50 pt-2">
              <div className="flex justify-between">
                <dt className="text-slate-400">Total</dt>
                <dd className="font-medium text-white">৳{Number(invoice.total_amount ?? 0).toFixed(2)}</dd>
              </div>
              <div className="mt-1 flex justify-between">
                <dt className="text-slate-400">Tax</dt>
                <dd className="text-slate-200">৳{Number(invoice.tax_amount ?? 0).toFixed(2)}</dd>
              </div>
              <div className="mt-1 flex justify-between">
                <dt className="font-medium text-white">Final amount</dt>
                <dd className="text-lg font-semibold text-[var(--primary)]">৳{Number(invoice.final_amount ?? 0).toFixed(2)}</dd>
              </div>
            </div>
          </dl>
        </div>

        {/* payment info */}
        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-white">Payment</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Method</dt>
              <dd className="capitalize text-slate-200">{invoice.payment_method ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Status</dt>
              <dd><StatusBadge status={invoice.payment_status ?? "pending"} /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Issued at</dt>
              <dd className="text-slate-200">{formatDateTime(invoice.issued_at)}</dd>
            </div>
          </dl>
        </div>

        {/* linked entities */}
        <div className="card p-6">
          <h2 className="mb-4 font-semibold text-white">Linked</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Ride</dt>
              <dd>
                <Link href={`/dashboard/rides/${invoice.ride_id}`} className="text-[var(--primary)] hover:underline">
                  View ride →
                </Link>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Customer</dt>
              <dd className="text-slate-200">{customer?.full_name ?? customer?.phone ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Rider</dt>
              <dd className="text-slate-200">{riderUser?.full_name ?? riderUser?.phone ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
