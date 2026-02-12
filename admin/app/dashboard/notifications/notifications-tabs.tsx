"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/dashboard/notifications", label: "Create" },
  { href: "/dashboard/notifications/list", label: "List" },
];

export function NotificationsTabs() {
  const pathname = usePathname();

  return (
    <div className="mt-4 mb-6 flex w-fit flex-wrap gap-1 rounded-lg border border-slate-700/50 bg-slate-800/50 p-1">
      {tabs.map((tab) => {
        const isActive =
          tab.href === "/dashboard/notifications"
            ? pathname === "/dashboard/notifications"
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
