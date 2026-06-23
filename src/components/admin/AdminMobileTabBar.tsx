"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FolderOpen,
  LayoutDashboard,
  UserPlus,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useAdminStore } from "@/lib/admin-store";
import { adminT } from "@/lib/i18n/admin-en";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/admin", icon: LayoutDashboard, labelKey: "nav.dashboard" as const },
  { href: "/admin/leads", icon: UserPlus, labelKey: "nav.leads" as const, badge: true },
  { href: "/admin/clients", icon: Users, labelKey: "nav.clients" as const },
  { href: "/admin/offers", icon: Briefcase, labelKey: "nav.offers" as const },
  { href: "/admin/case-studies", icon: FolderOpen, labelKey: "nav.caseStudies" as const },
];

export function AdminMobileTabBar() {
  const pathname = usePathname();
  const { leads } = useAdminStore();
  const newCount = leads.filter((l) => l.stage === "new").length;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm md:hidden"
      aria-label="Admin navigation"
    >
      <div className="flex h-16 items-stretch justify-around">
        {tabs.map((tab) => {
          const active =
            tab.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium transition-colors",
                active ? "text-gold" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{adminT(tab.labelKey)}</span>
              {tab.badge && newCount > 0 && (
                <Badge className="absolute right-2 top-1 h-4 min-w-4 px-1 text-[9px] bg-gold text-gold-foreground">
                  {newCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
