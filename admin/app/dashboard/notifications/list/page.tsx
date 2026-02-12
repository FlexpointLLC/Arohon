import { NotificationsList } from "../notifications-list";

export default function NotificationsListPage() {
  return (
    <div className="card p-6">
      <h2 className="font-semibold text-white">Sent notifications</h2>
      <p className="mt-1 text-sm text-slate-400">View and paginate sent in-app notifications.</p>
      <div className="mt-4">
        <NotificationsList />
      </div>
    </div>
  );
}
