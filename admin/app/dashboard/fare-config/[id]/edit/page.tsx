import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import { FareConfigEditForm } from "./fare-config-edit-form";

export default async function FareConfigEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: row } = await supabaseAdmin
    .from("fare_config")
    .select("*")
    .eq("id", id)
    .single();

  if (!row) notFound();

  const vehicleLabel = String(row.vehicle_type || "Fare").trim() || "Fare";
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/fare-config"
                className="flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:bg-slate-800 hover:text-white"
              >
                <span aria-hidden>←</span>
                Back
              </Link>
              <span className="text-slate-600">/</span>
              <h1 className="text-xl font-semibold tracking-tight text-white">
                Edit fare config
              </h1>
              <span className="rounded-md bg-slate-700/80 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-slate-300">
                {vehicleLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-6 py-8">
        <FareConfigEditForm row={row as Record<string, unknown>} />
      </div>
    </div>
  );
}
