"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Phone, Trash2, UserX } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { EmptyState } from "@/components/admin/EmptyState";
import { LeadSlideOver } from "@/components/admin/leads/LeadSlideOver";
import { formatDzd } from "@/lib/booking/build-lead-payload";
import { resolveOfferLabel } from "@/lib/offers";
import { adminT } from "@/lib/i18n/admin-en";
import { useAbandonedLeads, useDeleteLead } from "@/lib/queries/leads";
import { useOffers } from "@/lib/queries/offers";
import type { Lead } from "@/lib/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export function AbandonedLeadsPageContent() {
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [slideOpen, setSlideOpen] = useState(false);
  const { data: offers = [] } = useOffers({ activeOnly: true });
  const { data: leads = [], isLoading, isError } = useAbandonedLeads(search.trim() || undefined);
  const deleteLeadMutation = useDeleteLead();

  const sortedLeads = useMemo(
    () => [...leads].sort((a, b) => (b.abandonedAt ?? b.updatedAt ?? "").localeCompare(a.abandonedAt ?? a.updatedAt ?? "")),
    [leads],
  );

  const handleDelete = async (lead: Lead) => {
    if (!confirm(adminT("abandonedLeads.deleteConfirm", { name: lead.name }))) return;
    try {
      await deleteLeadMutation.mutateAsync(lead.id);
      toast.success(adminT("abandonedLeads.deleted"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : adminT("common.error"));
    }
  };

  return (
    <AdminPageShell
      title={adminT("abandonedLeads.title")}
      description={adminT("abandonedLeads.description")}
    >
      <div className="flex flex-col gap-4">
        <Input
          placeholder={adminT("abandonedLeads.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-h-11 max-w-md"
        />

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">{adminT("abandonedLeads.loadError")}</p>
        ) : sortedLeads.length === 0 ? (
          <EmptyState
            icon={UserX}
            title={adminT("abandonedLeads.emptyTitle")}
            description={adminT("abandonedLeads.emptyDescription")}
          />
        ) : (
          <div className="space-y-3">
            {sortedLeads.map((lead) => {
              const packSlug = lead.selectedPackSlug ?? lead.interestedIn[0];
              const packLabel = packSlug ? resolveOfferLabel(offers, packSlug) : "—";

              return (
                <article
                  key={lead.id}
                  className="rounded-xl border border-amber-200/60 bg-amber-50/40 p-4 transition hover:border-amber-300"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <button
                      type="button"
                      className="min-w-0 flex-1 text-left"
                      onClick={() => {
                        setSelectedLead(lead);
                        setSlideOpen(true);
                      }}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-ink">{lead.name}</h3>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                          {adminT("abandonedLeads.badge")}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {lead.phone && (
                          <span className="inline-flex items-center gap-1">
                            <Phone className="h-3.5 w-3.5" />
                            {lead.phone}
                          </span>
                        )}
                        {lead.projectName && <span>{lead.projectName}</span>}
                        <span>{packLabel}</span>
                        {lead.estimatedTotalDzd != null && (
                          <span className="font-medium text-ruby">
                            {formatDzd(lead.estimatedTotalDzd)}
                          </span>
                        )}
                      </div>
                      {lead.abandonedAt && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {adminT("abandonedLeads.abandonedAt")}{" "}
                          {format(new Date(lead.abandonedAt), "PPp", { locale: fr })}
                        </p>
                      )}
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                      onClick={() => void handleDelete(lead)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {adminT("common.delete")}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <LeadSlideOver
        lead={selectedLead}
        open={slideOpen}
        onOpenChange={(open) => {
          setSlideOpen(open);
          if (!open) setSelectedLead(null);
        }}
      />
    </AdminPageShell>
  );
}
