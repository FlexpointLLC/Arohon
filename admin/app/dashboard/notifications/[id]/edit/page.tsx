import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";
import Link from "next/link";
import { EditNotificationForm } from "./edit-notification-form";

export default async function EditNotificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: notif } = await supabaseAdmin
    .from("notifications")
    .select("id, user_id, title, body, notification_type, created_at")
    .eq("id", id)
    .single();

  if (!notif) notFound();

  return (
    <div className="card max-w-lg p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-white">Edit notification</h2>
        <Link
          href="/dashboard/notifications/list"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Back to list
        </Link>
      </div>
      <EditNotificationForm
        id={notif.id}
        initialUserId={notif.user_id ?? ""}
        initialTitle={notif.title}
        initialBody={notif.body}
        initialType={notif.notification_type ?? "general"}
      />
    </div>
  );
}
