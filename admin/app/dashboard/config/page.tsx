import { supabaseAdmin } from "@/lib/supabase/server";
import { SupportForm } from "./support-form";

export default async function ConfigPage() {
  const { data: supportRow } = await supabaseAdmin
    .from("system_settings")
    .select("setting_key, setting_value, support_phone")
    .eq("setting_key", "support_phone")
    .maybeSingle();

  return (
    <div className="card p-6">
      <h2 className="font-semibold text-white">Support phone</h2>
      <p className="mt-1 text-sm text-slate-400">
        Shown in customer app &quot;Call Support&quot;.
      </p>
      <div className="mt-4">
        <SupportForm initialPhone={(supportRow as any)?.support_phone ?? ""} />
      </div>
    </div>
  );
}
