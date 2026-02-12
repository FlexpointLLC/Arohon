import { NotificationsTabs } from "./notifications-tabs";

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        Notifications
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Create in-app notifications for customers or drivers. Leave user empty for broadcast.
      </p>
      <NotificationsTabs />
      {children}
    </div>
  );
}
