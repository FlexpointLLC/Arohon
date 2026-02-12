import { CreateNotificationForm } from "./create-notification-form";

export default function NotificationsPage() {
  return (
    <div className="card max-w-lg p-6">
      <h2 className="font-semibold text-white">Create notification</h2>
      <p className="mt-1 text-sm text-slate-400">Send to a user or broadcast.</p>
      <div className="mt-4">
        <CreateNotificationForm />
      </div>
    </div>
  );
}
