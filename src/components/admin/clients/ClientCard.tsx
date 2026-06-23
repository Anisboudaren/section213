import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { adminT } from "@/lib/i18n/admin-en";
import type { Client } from "@/lib/types/admin";
import { MOCK_PROJECTS } from "@/lib/mock-data/projects";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const statusStyles: Record<Client["status"], string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-muted text-muted-foreground",
  vip: "bg-gold/20 text-ink border-gold/30",
};

type ClientCardProps = {
  client: Client;
};

export function ClientCard({ client }: ClientCardProps) {
  const activeProjects = MOCK_PROJECTS.filter(
    (p) => client.projectIds.includes(p.id) && p.status === "active",
  ).length;

  return (
    <Link href={`/admin/clients/${client.id}`}>
      <Card className="h-full border-ink/10 transition-colors hover:border-gold/40 hover:bg-gold/5">
        <CardContent className="flex flex-col gap-3 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-gold font-display text-sm">
              {getInitials(client.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink truncate">{client.name}</p>
              <p className="text-sm text-muted-foreground truncate">{client.company}</p>
            </div>
            <Badge variant="outline" className={cn("shrink-0", statusStyles[client.status])}>
              {adminT(`clients.statuses.${client.status}` as Parameters<typeof adminT>[0])}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {client.totalRevenue != null && (
              <span>
                {client.totalRevenue.toLocaleString("fr-DZ")} DZD
              </span>
            )}
            <span>
              {activeProjects} {adminT("clients.activeProjects")}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
