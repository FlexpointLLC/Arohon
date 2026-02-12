import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminUser();
  if (!admin) {
    redirect("/unauthorized");
  }

  const [{ count: openSupportCount }, { count: pendingVerificationCount }] =
    await Promise.all([
      supabaseAdmin
        .from("support_tickets")
        .select("id", { count: "exact", head: true })
        .in("status", ["open", "in_progress"]),
      supabaseAdmin
        .from("riders")
        .select("id", { count: "exact", head: true })
        .eq("verification_status", "pending"),
    ]);

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        admin={admin}
        openSupportCount={openSupportCount ?? 0}
        pendingVerificationCount={pendingVerificationCount ?? 0}
      />
      <main className="min-w-0 flex-1 overflow-auto bg-slate-900">
        {children}
      </main>
    </div>
  );
}
