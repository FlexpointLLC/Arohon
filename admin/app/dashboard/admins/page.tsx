import { supabaseAdmin } from "@/lib/supabase/server";
import { AdminsList } from "./admins-list";

export default async function AdminsPage() {
  const { data: admins } = await supabaseAdmin
    .from("admin_users")
    .select(`
      id,
      user_id,
      role,
      is_active,
      created_at,
      users ( id, email, full_name )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Admin users</h1>
      <p className="mt-1 text-sm text-slate-400">
        Manage admin accounts. Deactivate to revoke dashboard access.
      </p>
      <div className="card mt-6 overflow-hidden">
        <AdminsList initialAdmins={(admins ?? []) as any} />
      </div>
    </div>
  );
}
