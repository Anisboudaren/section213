"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { LayoutGrid, List, Plus, UserPlus } from "lucide-react";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { DataTable } from "@/components/admin/DataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { LeadSlideOver } from "@/components/admin/LeadSlideOver";
import { LeadStageBadge } from "@/components/admin/LeadStageBadge";
import { SourceIcon } from "@/components/admin/SourceIcon";
import { LeadForm, type LeadFormValues } from "@/components/admin/leads/LeadForm";
import { LeadKanban } from "@/components/admin/leads/LeadKanban";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminStore } from "@/lib/admin-store";
import { adminT } from "@/lib/i18n/admin-en";
import type { Lead, LeadSource, LeadStage } from "@/lib/types/admin";

const SOURCES: LeadSource[] = [
  "instagram",
  "tiktok",
  "facebook",
  "google",
  "referral",
  "website",
  "cold",
  "other",
];

const STAGES: LeadStage[] = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
];

export default function LeadsPage() {
  const { leads, addLead, offers } = useAdminStore();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [slideOpen, setSlideOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.company?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q);
      const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
      const matchesStage = stageFilter === "all" || lead.stage === stageFilter;
      return matchesSearch && matchesSource && matchesStage;
    });
  }, [leads, search, sourceFilter, stageFilter]);

  const newCount = leads.filter((l) => l.stage === "new").length;

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setSlideOpen(true);
  };

  const handleAddLead = (values: LeadFormValues) => {
    addLead({
      ...values,
      email: values.email || undefined,
      company: values.company || undefined,
      phone: values.phone || undefined,
      utmCampaign: values.utmCampaign || undefined,
      utmMedium: values.utmMedium || undefined,
      pixelEventFired: values.pixelEventFired || undefined,
      createdAt: new Date().toISOString(),
    });
    setAddOpen(false);
  };

  const getOfferNames = (ids: string[]) =>
    ids
      .map((id) => offers.find((o) => o.id === id)?.name)
      .filter(Boolean)
      .join(", ");

  return (
    <AdminPageShell
      title={adminT("leads.title")}
      description={adminT("leads.count", { count: leads.length })}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="sr-only">{adminT("leads.title")}</h2>
            <Badge variant="outline" className="border-gold/30 bg-gold/10 text-ink">
              {adminT("leads.newCount", { count: newCount })}
            </Badge>
            <Button variant="gold" className="min-h-11" onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              {adminT("leads.addLead")}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder={adminT("leads.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-h-11 w-full sm:w-48"
            />
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="min-h-11 w-full sm:w-36">
                <SelectValue placeholder={adminT("leads.filterSource")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{adminT("common.all")}</SelectItem>
                {SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {adminT(`leads.sources.${s}` as Parameters<typeof adminT>[0])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="min-h-11 w-full sm:w-36">
                <SelectValue placeholder={adminT("leads.filterStage")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{adminT("common.all")}</SelectItem>
                {STAGES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {adminT(`leads.stages.${s}` as Parameters<typeof adminT>[0])}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex rounded-lg border border-ink/10 p-1">
              <Button
                variant={view === "kanban" ? "secondary" : "ghost"}
                size="sm"
                className="min-h-11 min-w-11"
                onClick={() => setView("kanban")}
                aria-label={adminT("common.kanban")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="sm"
                className="min-h-11 min-w-11"
                onClick={() => setView("list")}
                aria-label={adminT("common.list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title={adminT("leads.emptyTitle")}
            description={adminT("leads.emptyDescription")}
            action={{ label: adminT("leads.addLead"), onClick: () => setAddOpen(true) }}
          />
        ) : view === "kanban" ? (
          <LeadKanban leads={filtered} onLeadClick={handleLeadClick} />
        ) : (
          <DataTable
            data={filtered}
            getRowKey={(l) => l.id}
            onRowClick={handleLeadClick}
            columns={[
              {
                key: "name",
                header: adminT("common.name"),
                sortable: true,
                sortValue: (l) => l.name,
                cell: (l) => (
                  <div>
                    <p className="font-medium">{l.name}</p>
                    {l.company && (
                      <p className="text-xs text-muted-foreground">{l.company}</p>
                    )}
                  </div>
                ),
              },
              {
                key: "source",
                header: adminT("leads.filterSource"),
                cell: (l) => <SourceIcon source={l.source} />,
              },
              {
                key: "stage",
                header: adminT("leads.stage"),
                cell: (l) => <LeadStageBadge stage={l.stage} />,
              },
              {
                key: "interested",
                header: adminT("leads.interestedIn"),
                className: "hidden md:table-cell",
                headerClassName: "hidden md:table-cell",
                cell: (l) => (
                  <span className="text-sm text-muted-foreground">
                    {getOfferNames(l.interestedIn) || "—"}
                  </span>
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
                cell: () => (
                  <Button variant="ghost" size="sm" className="min-h-11">
                    {adminT("common.view")}
                  </Button>
                ),
              },
            ]}
          />
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

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{adminT("leads.addLead")}</DialogTitle>
          </DialogHeader>
          <LeadForm onSubmit={handleAddLead} formId="add-lead-form" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              {adminT("common.cancel")}
            </Button>
            <Button variant="gold" type="submit" form="add-lead-form" className="min-h-11">
              {adminT("common.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminPageShell>
  );
}
