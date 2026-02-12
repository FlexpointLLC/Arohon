"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Layout as LayoutIcon,
  SealPercent,
  Car,
  CurrencyCircleDollar,
  Users,
  ShieldCheck,
  ChatCircle,
  Wallet,
  Receipt,
  ArrowsLeftRight,
  Gear,
  Bell,
  SignOut,
  UsersThree,
  UserPlus,
} from "@phosphor-icons/react";

const dashboardItem = { href: "/dashboard", label: "Dashboard", icon: LayoutIcon };
const ridesItem = { href: "/dashboard/rides", label: "Rides", icon: Car };

const fareGroup = {
  label: "Fare",
  items: [
    { href: "/dashboard/commission", label: "Rider commission", icon: SealPercent },
    { href: "/dashboard/fare-config", label: "Fare config", icon: CurrencyCircleDollar },
  ],
};

const driversGroup = {
  label: "Drivers",
  items: [
    { href: "/dashboard/users", label: "Users", icon: Users },
    { href: "/dashboard/verification", label: "Verification", icon: ShieldCheck },
    { href: "/dashboard/support", label: "Support", icon: ChatCircle },
    { href: "/dashboard/payments", label: "Payments", icon: Wallet },
  ],
};

const financeGroup = {
  label: "Finance",
  items: [
    { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
    { href: "/dashboard/transactions", label: "Transactions", icon: ArrowsLeftRight },
  ],
};

const systemGroup = {
  label: "System",
  items: [
    { href: "/dashboard/config", label: "Configuration", icon: Gear },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { href: "/dashboard/admins", label: "Admins", icon: UsersThree },
    { href: "/dashboard/referrals", label: "Referrals", icon: UserPlus },
  ],
};

export function DashboardSidebar({
  admin,
  openSupportCount = 0,
  pendingVerificationCount = 0,
}: {
  admin: AdminUser;
  openSupportCount?: number;
  pendingVerificationCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-700/80 bg-slate-800/80">
      <div className="shrink-0 border-b border-slate-700/80 px-5 py-6">
        <Link href="/dashboard" className="block">
          <img src="/arohon.svg" alt="Arohon" className="h-8 w-auto" />
        </Link>
        <p className="mt-1 truncate text-xs text-slate-400">
          {admin.user?.full_name || admin.user?.email || "Admin"} · {admin.role}
        </p>
      </div>
      <nav className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4">
        <Link href={dashboardItem.href}>
          <span
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-normal text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white",
              pathname === dashboardItem.href && "bg-slate-700/80 text-white"
            )}
          >
            <dashboardItem.icon className="h-5 w-5 shrink-0" size={20} />
            {dashboardItem.label}
          </span>
        </Link>

        <Link href={ridesItem.href}>
          <span
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-normal text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white",
              (pathname === ridesItem.href || pathname.startsWith(ridesItem.href + "/")) && "bg-slate-700/80 text-white"
            )}
          >
            <ridesItem.icon className="h-5 w-5 shrink-0" size={20} />
            {ridesItem.label}
          </span>
        </Link>

        <div>
          <p className="mt-3 mb-1 px-3 text-xs font-medium uppercase tracking-wider text-slate-500">
            {fareGroup.label}
          </p>
          <div className="space-y-0.5">
            {fareGroup.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-normal text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white",
                      isActive && "bg-slate-700/80 text-white"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" size={20} />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mt-3 mb-1 px-3 text-xs font-medium uppercase tracking-wider text-slate-500">
            {driversGroup.label}
          </p>
          <div className="space-y-0.5">
            {driversGroup.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              const showSupportBadge = item.href === "/dashboard/support" && openSupportCount > 0;
              const showVerificationBadge = item.href === "/dashboard/verification" && pendingVerificationCount > 0;
              const badgeCount = item.href === "/dashboard/support" ? openSupportCount : item.href === "/dashboard/verification" ? pendingVerificationCount : 0;
              const showBadge = showSupportBadge || showVerificationBadge;
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-normal text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white",
                      isActive && "bg-slate-700/80 text-white"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" size={20} />
                    {item.label}
                    {showBadge && (
                      <span className="ml-auto min-w-[1.25rem] rounded-full bg-amber-500/90 px-1.5 py-0.5 text-center text-xs font-semibold text-white">
                        {badgeCount > 99 ? "99+" : badgeCount}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mt-3 mb-1 px-3 text-xs font-medium uppercase tracking-wider text-slate-500">
            {financeGroup.label}
          </p>
          <div className="space-y-0.5">
            {financeGroup.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-normal text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white",
                      isActive && "bg-slate-700/80 text-white"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" size={20} />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mt-3 mb-1 px-3 text-xs font-medium uppercase tracking-wider text-slate-500">
            {systemGroup.label}
          </p>
          <div className="space-y-0.5">
            {systemGroup.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-normal text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white",
                      isActive && "bg-slate-700/80 text-white"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" size={20} />
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      <div className="border-t border-slate-700/80 p-3">
        <Button type="button" variant="ghost" className="w-full justify-start gap-3 text-slate-400" onClick={handleLogout}>
          <SignOut className="h-5 w-5 shrink-0" size={20} />
          Log out
        </Button>
      </div>
    </aside>
  );
}
