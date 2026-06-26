"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  isNavActive,
  MOBILE_TABS,
  NAV_GROUPS,
  type SidebarBadge,
} from "@/lib/admin/sidebar-nav";
import { cn } from "@/lib/utils";

type AdminMobileTabBarProps = {
  newLeadCount: number;
  overdueProjectCount: number;
};

function getBadgeCount(
  badge: SidebarBadge | false | undefined,
  newLeadCount: number,
  overdueProjectCount: number,
) {
  if (badge === "newLeads") return newLeadCount;
  if (badge === "overdueProjects") return overdueProjectCount;
  return 0;
}

export function AdminMobileTabBar({
  newLeadCount,
  overdueProjectCount,
}: AdminMobileTabBarProps) {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm md:hidden"
        aria-label="Admin navigation"
      >
        <div className="flex h-16 items-stretch justify-around">
          {MOBILE_TABS.map((tab) => {
            const isPlus = tab.href === null;
            const active =
              !isPlus &&
              isNavActive(tab.href, pathname);
            const Icon = tab.icon;
            const count = getBadgeCount(tab.badge, newLeadCount, overdueProjectCount);

            if (isPlus) {
              return (
                <button
                  key="plus"
                  type="button"
                  onClick={() => setSheetOpen(true)}
                  className="relative flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium text-muted-foreground"
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  <span>{tab.label}</span>
                </button>
              );
            }

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
                <span className="truncate">{tab.label}</span>
                {count > 0 && (
                  <Badge className="absolute right-2 top-1 h-4 min-w-4 px-1 text-[9px] bg-gold text-gold-foreground">
                    {count}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-6 pb-6">
            {NAV_GROUPS.map((group) => (
              <div key={group.label ?? "top"}>
                {group.label && (
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {group.label}
                  </p>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const active = isNavActive(item.href, pathname);
                    const Icon = item.icon;
                    const count = getBadgeCount(
                      item.badge,
                      newLeadCount,
                      overdueProjectCount,
                    );

                    return (
                      <Button
                        key={item.href}
                        asChild
                        variant={active ? "secondary" : "ghost"}
                        className={cn(
                          "min-h-11 w-full justify-start",
                          active && "border-l-2 border-gold bg-gold/10",
                        )}
                        onClick={() => setSheetOpen(false)}
                      >
                        <Link href={item.href}>
                          <Icon className="mr-2 h-4 w-4" />
                          {item.label}
                          {count > 0 && (
                            <Badge className="ml-auto bg-gold text-gold-foreground">
                              {count}
                            </Badge>
                          )}
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
