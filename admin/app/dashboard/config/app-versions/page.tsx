import { supabaseAdmin } from "@/lib/supabase/server";
import { AppVersionEditor } from "../app-version-editor";

export default async function ConfigAppVersionsPage() {
  const { data: driverVersion } = await supabaseAdmin
    .from("app_version_control")
    .select("*")
    .eq("app_key", "driver_app")
    .eq("platform", "android")
    .maybeSingle();

  const { data: customerVersion } = await supabaseAdmin
    .from("app_version_control")
    .select("*")
    .in("app_key", ["customer_app", "arohon_customer"])
    .limit(1)
    .maybeSingle();

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-white">App version control</h2>
      <p className="mt-1 text-sm text-slate-400">
        Min required version, latest version, store URLs, and changelog for driver and customer apps.
      </p>
      <div className="mt-4">
        <AppVersionEditor
          driverVersion={driverVersion as any}
          customerVersion={customerVersion as any}
        />
      </div>
    </div>
  );
}
