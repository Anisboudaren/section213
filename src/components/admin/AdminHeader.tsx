import { Link, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getPageMeta } from "@/lib/admin/navigation";

type AdminHeaderProps = {
  onOpenCommand: () => void;
};

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
  const crumbs: { label: string; href?: string }[] = [{ label: "Admin", href: "/admin" }];

  let path = "/admin";
  for (const segment of segments) {
    path += `/${segment}`;
    const meta = getPageMeta(path);
    crumbs.push({
      label: meta?.title ?? segment.replace(/-/g, " "),
      href: path,
    });
  }

  return crumbs;
}

export function AdminHeader({ onOpenCommand }: AdminHeaderProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const crumbs = buildBreadcrumbs(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumb className="hidden min-w-0 flex-1 sm:block">
        <BreadcrumbList>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <span key={`${crumb.label}-${index}`} className="contents">
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={crumb.href!}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </span>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden md:flex" onClick={onOpenCommand}>
          <Search className="mr-2 h-4 w-4" />
          Search
          <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium lg:inline-flex">
            ⌘K
          </kbd>
        </Button>
        <Button variant="outline" size="icon" className="md:hidden" onClick={onOpenCommand}>
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
