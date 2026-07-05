"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Plus, Search } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { clearAdminAuth } from "@/lib/admin/auth";
import { logoutAction } from "@/lib/actions/auth";
import {
  HIDDEN_NAV_ITEMS,
  isNavActive,
  NAV_GROUPS,
  type SidebarBadge,
} from "@/lib/admin/sidebar-nav";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { adminT } from "@/lib/i18n/admin-en";
import { cn } from "@/lib/utils";

type AdminSidebarProps = {
  newLeadCount: number;
  overdueProjectCount: number;
  onOpenCommand: () => void;
};

function getBadgeCount(
  badge: SidebarBadge | undefined,
  newLeadCount: number,
  overdueProjectCount: number,
) {
  if (badge === "newLeads") return newLeadCount;
  if (badge === "overdueProjects") return overdueProjectCount;
  return 0;
}

export function AdminSidebar({
  newLeadCount,
  overdueProjectCount,
  onOpenCommand,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const user = useCurrentUser();
  const [hiddenOpen, setHiddenOpen] = useState(false);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    clearAdminAuth();
    await logoutAction();
    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="icon" className="hidden border-sidebar-border md:flex md:w-60 lg:w-60">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="Section 213">
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-ink text-gold">
                  <span className="font-display text-sm">213</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-display tracking-wide text-ink">SECTION 213</span>
                  <span className="truncate text-xs text-muted-foreground">Admin CRM</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map((group) => (
          <SidebarGroup key={group.label ?? "dashboard"}>
            {group.label && (
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isNavActive(item.href, pathname);
                  const count = getBadgeCount(
                    item.badge,
                    newLeadCount,
                    overdueProjectCount,
                  );
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className={cn(
                          active &&
                            "border-l-2 border-gold bg-gold/10 text-ink hover:bg-gold/15 hover:text-ink",
                        )}
                      >
                        <Link href={item.href}>
                          <Icon className={cn(active && "text-gold")} />
                          <span>{item.label}</span>
                          {count > 0 && item.badge && (
                            <>
                              <Badge
                                className={cn(
                                  "ml-auto h-5 min-w-5 px-1 text-[10px] group-data-[collapsible=icon]:hidden",
                                  item.badgeColor === "red"
                                    ? "bg-red-600 text-white"
                                    : "bg-gold text-gold-foreground",
                                )}
                              >
                                {count}
                              </Badge>
                              <span
                                className={cn(
                                  "ml-auto hidden size-2 rounded-full group-data-[collapsible=icon]:inline",
                                  item.badgeColor === "red" ? "bg-red-600" : "bg-gold",
                                )}
                                aria-label={`${count} notifications`}
                              />
                            </>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup className="mt-auto">
          <Collapsible open={hiddenOpen} onOpenChange={setHiddenOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="min-h-9 w-full justify-start gap-2 px-2 text-muted-foreground group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
              >
                <Plus className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Plus de modules</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 px-2 py-1 group-data-[collapsible=icon]:hidden">
              {HIDDEN_NAV_ITEMS.map((item) => (
                <div
                  key={item.href}
                  className="flex items-center justify-between rounded-md px-2 py-1.5 text-xs text-muted-foreground"
                >
                  <span>{item.label}</span>
                  <Badge variant="outline" className="text-[10px]">
                    Bientôt
                  </Badge>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Recherche (Ctrl+K)" onClick={onOpenCommand}>
              <Search />
              <span className="group-data-[collapsible=icon]:hidden">Recherche</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        <div className="flex items-center gap-2 p-2">
          <Avatar className="h-8 w-8 shrink-0 rounded-lg">
            {user.avatar ? <AvatarImage src={user.avatar} alt="" className="rounded-lg object-cover" /> : null}
            <AvatarFallback className="rounded-lg bg-gold text-gold-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.displayRole}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="min-h-9 min-w-9 shrink-0"
            aria-label={adminT("nav.signOut")}
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
