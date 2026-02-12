import { ConfigTabs } from "./config-tabs";

export default function ConfigLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">
        Configuration
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Support phone, system settings, and app version control
      </p>
      <ConfigTabs />
      {children}
    </div>
  );
}
