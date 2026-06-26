import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";

import { ClientAvatar } from "@/components/admin/clients/ClientAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ClientDto } from "@/lib/actions/clients";
import { adminT } from "@/lib/i18n/admin-en";
import { formatDZD } from "@/lib/utils/client-helpers";
import { cn } from "@/lib/utils";

const statusStyles = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-muted text-muted-foreground border-border",
  vip: "bg-gold/20 text-ink border-gold/30",
} as const;

type ClientCardProps = {
  client: ClientDto;
};

export function ClientCard({ client }: ClientCardProps) {
  return (
    <Card className="relative h-full border-ink/10 transition-colors hover:border-gold/40 hover:bg-gold/5">
      {client.showOnWebsite && (
        <Globe className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden />
      )}
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <ClientAvatar
            name={client.company || client.name}
            logoUrl={client.logoUrl}
            size="sm"
          />
          <div className="min-w-0 flex-1 pr-6">
            <p className="truncate font-medium text-ink">{client.name}</p>
            <p className="truncate text-sm text-muted-foreground">{client.company}</p>
            {client.industry && (
              <p className="truncate text-xs text-muted-foreground">{client.industry}</p>
            )}
          </div>
          <Badge variant="outline" className={cn("shrink-0", statusStyles[client.status])}>
            {adminT(`clients.statuses.${client.status}` as Parameters<typeof adminT>[0])}
          </Badge>
        </div>

        <div className="border-t border-ink/10 pt-3 text-sm text-muted-foreground">
          <div className="flex items-center justify-between gap-2">
            <span>
              {client.projectCount ?? 0} projet{(client.projectCount ?? 0) !== 1 ? "s" : ""}
            </span>
            <span>{formatDZD(client.totalRevenue)}</span>
          </div>
          {client.lastProjectName && (
            <p className="mt-1 truncate text-xs">
              Dernier projet: {client.lastProjectName}
            </p>
          )}
        </div>

        <Button asChild variant="outline" className="min-h-11 w-full">
          <Link href={`/admin/clients/${client.id}`}>
            Ouvrir
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
