import { supabaseAdmin } from "@/lib/supabase/server";
import { CommissionForm } from "../config/commission-form";

export default async function CommissionPage() {
  const { data: row } = await supabaseAdmin
    .from("system_settings")
    .select("setting_value")
    .eq("setting_key", "rider_commission_percentage")
    .maybeSingle();

  const initialPercent =
    row?.setting_value != null ? Number(row.setting_value) : 9;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        Rider commission
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Commission is controlled from system_settings only. A DB trigger (trg_system_settings_commission_sync) syncs this value to every rider. Do not edit riders&apos; commission in the admin—the trigger keeps it in sync.
      </p>
      <div className="card mt-6 p-6">
        <h2 className="font-semibold text-white">Commission (%)</h2>
        <p className="mt-1 text-sm text-slate-400">
          Updates the row system_settings where setting_key = &quot;rider_commission_percentage&quot;. The driver app and backend read this for new completions.
        </p>
        <div className="mt-4">
          <CommissionForm initialPercent={initialPercent} />
        </div>
      </div>
    </div>
  );
}
