"use client";

import { format } from "date-fns";
import { MoreHorizontal, Pencil, Trash2, UserCheck, UserPlus } from "lucide-react";

import { DataTable } from "@/components/admin/DataTable";
import { LeadStageBadge } from "@/components/admin/LeadStageBadge";
import { LeadSourceBadge } from "@/components/admin/leads/LeadSourceBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { resolveOfferLabel } from "@/lib/offers";
import { adminT } from "@/lib/i18n/admin-en";
import { useOffers } from "@/lib/queries/offers";
import { TEAM } from "@/lib/mock-data/team";
import type { Lead } from "@/lib/types/admin";

type LeadListProps = {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  onMarkContacted: (lead: Lead) => void;
  onUpgrade: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
};

export function LeadList({
  leads,
  onLeadClick,
  onMarkContacted,
  onUpgrade,
  onDelete,
}: LeadListProps) {
  const { data: offers = [] } = useOffers({ activeOnly: true });
  const getAssigneeName = (id?: string) =>
    TEAM.find((m) => m.id === id)?.name ?? adminT("leads.unassigned");

  return (
    <DataTable
      data={leads}
      getRowKey={(l) => l.id}
      onRowClick={onLeadClick}
      columns={[
        {
          key: "name",
          header: adminT("common.name"),
          sortable: true,
          sortValue: (l) => l.name,
          cell: (l) => (
            <div>
              <p className="font-medium">{l.name}</p>
              <div className="mt-1 md:hidden">
                <LeadSourceBadge source={l.source} />
              </div>
            </div>
          ),
        },
        {
          key: "source",
          header: adminT("leads.filterSource"),
          className: "hidden md:table-cell",
          headerClassName: "hidden md:table-cell",
          cell: (l) => <LeadSourceBadge source={l.source} />,
        },
        {
          key: "stage",
          header: adminT("leads.stage"),
          sortable: true,
          sortValue: (l) => l.stage,
          cell: (l) => <LeadStageBadge stage={l.stage} />,
        },
        {
          key: "interested",
          header: adminT("leads.interestedIn"),
          className: "hidden lg:table-cell",
          headerClassName: "hidden lg:table-cell",
          cell: (l) => (
            <span className="text-sm text-muted-foreground">
              {l.interestedIn.map((slug) => resolveOfferLabel(offers, slug)).join(", ") || "—"}
            </span>
          ),
        },
        {
          key: "assigned",
          header: adminT("leads.assignedTo"),
          className: "hidden xl:table-cell",
          headerClassName: "hidden xl:table-cell",
          cell: (l) => (
            <span className="text-sm text-muted-foreground">{getAssigneeName(l.assignedTo)}</span>
          ),
        },
        {
          key: "created",
          header: adminT("common.created"),
          sortable: true,
          sortValue: (l) => l.createdAt,
          className: "hidden lg:table-cell",
          headerClassName: "hidden lg:table-cell",
          cell: (l) => format(new Date(l.createdAt), "MMM d, yyyy"),
        },
        {
          key: "actions",
          header: adminT("common.actions"),
          cell: (l) => (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="min-h-11 min-w-11"
                onClick={() => onLeadClick(l)}
                aria-label={adminT("common.edit")}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="min-h-11 min-w-11">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onMarkContacted(l)}>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Marquer contacté
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onUpgrade(l)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {adminT("leads.upgradeToClient")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(l)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {adminT("common.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ),
        },
      ]}
    />
  );
}
