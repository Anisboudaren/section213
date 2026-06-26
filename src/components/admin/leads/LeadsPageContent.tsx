"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, LayoutGrid, Link2, List, Plus, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { EmptyState } from "@/components/admin/EmptyState";
import { GenerateLinkModal } from "@/components/admin/leads/GenerateLinkModal";
import { LeadKanban } from "@/components/admin/leads/LeadKanban";
import { LeadList } from "@/components/admin/leads/LeadList";
import { LeadSlideOver } from "@/components/admin/leads/LeadSlideOver";
import { NewLeadModal } from "@/components/admin/leads/NewLeadModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { adminT } from "@/lib/i18n/admin-en";
import type { LeadFilters } from "@/lib/actions/leads";
import { useDeleteLead, useLeads, useUpdateLead } from "@/lib/queries/leads";
import type { Lead, LeadSource, LeadStage } from "@/lib/types/admin";

const SOURCES: LeadSource[] = [
  "instagram",
  "tiktok",
  "facebook",
  "whatsapp",
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

const VIEW_STORAGE_KEY = "s213_leads_view";

export function LeadsPageContent() {
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [slideOpen, setSlideOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filters = useMemo<LeadFilters | undefined>(() => {
    const f: LeadFilters = {};
    if (sourceFilter !== "all") f.source = sourceFilter as LeadSource;
    if (stageFilter !== "all") f.stage = stageFilter as LeadStage;
    if (typeFilter === "booking") f.submissionType = "booking";
    if (search.trim()) f.search = search.trim();
    return Object.keys(f).length ? f : undefined;
  }, [search, sourceFilter, stageFilter, typeFilter]);

  const { data: leads = [], isLoading, isError } = useLeads(filters);
  const updateLeadMutation = useUpdateLead();
  const deleteLeadMutation = useDeleteLead();

  useEffect(() => {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === "kanban" || stored === "list") setView(stored);
  }, []);

  const setViewPersisted = (next: "kanban" | "list") => {
    setView(next);
    localStorage.setItem(VIEW_STORAGE_KEY, next);
  };

  const newCount = leads.filter((l) => l.stage === "new").length;

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setSlideOpen(true);
  };

  const handleMarkContacted = async (lead: Lead) => {
    try {
      await updateLeadMutation.mutateAsync({
        id: lead.id,
        data: { stage: "contacted", lastContactedAt: new Date().toISOString() },
      });
      toast.success("Marqué comme contacté");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const handleUpgrade = (lead: Lead) => {
    setSelectedLead(lead);
    setSlideOpen(true);
  };

  const handleDelete = async (lead: Lead) => {
    if (!confirm(`Supprimer le lead ${lead.name} ?`)) return;
    try {
      await deleteLeadMutation.mutateAsync(lead.id);
      toast.success("Lead supprimé");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  };

  const filterControls = (
    <>
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
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="min-h-11 w-full sm:w-36">
          <SelectValue placeholder={adminT("leads.filterType")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{adminT("common.all")}</SelectItem>
          <SelectItem value="booking">{adminT("leads.filterBookings")}</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  return (
    <AdminPageShell
      title={adminT("leads.title")}
      description={adminT("leads.count", { count: leads.length })}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-lg tracking-wide">
                {adminT("leads.title")} ({leads.length})
              </h2>
              <Badge variant="outline" className="border-gold/30 bg-gold/10 text-ink">
                {adminT("leads.newCount", { count: newCount })}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="gold" className="min-h-11" onClick={() => setAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {adminT("leads.addLead")}
              </Button>
              <Button variant="outline" className="min-h-11" onClick={() => setLinkOpen(true)}>
                <Link2 className="mr-2 h-4 w-4" />
                Generate Link
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden flex-wrap items-center gap-2 md:flex">{filterControls}</div>

            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="min-h-11 md:hidden">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtres
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-auto max-h-[85dvh] overflow-y-auto rounded-t-2xl px-4 pb-6 pt-4">
                <SheetHeader className="text-left">
                  <SheetTitle>Filtres</SheetTitle>
                </SheetHeader>
                <div className="mt-4 flex flex-col gap-3 pb-6">{filterControls}</div>
              </SheetContent>
            </Sheet>

            <div className="ml-auto flex rounded-lg border border-ink/10 p-1">
              <Button
                variant={view === "kanban" ? "secondary" : "ghost"}
                size="sm"
                className="min-h-11 min-w-11 gap-1"
                onClick={() => setViewPersisted("kanban")}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Kanban</span>
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="sm"
                className="min-h-11 min-w-11 gap-1"
                onClick={() => setViewPersisted("list")}
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Liste</span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <p className="text-sm text-destructive">Impossible de charger les leads.</p>
        ) : leads.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title={adminT("leads.emptyTitle")}
            description={adminT("leads.emptyDescription")}
            action={{ label: adminT("leads.addLead"), onClick: () => setAddOpen(true) }}
          />
        ) : view === "kanban" ? (
          <LeadKanban leads={leads} onLeadClick={handleLeadClick} />
        ) : (
          <LeadList
            leads={leads}
            onLeadClick={handleLeadClick}
            onMarkContacted={handleMarkContacted}
            onUpgrade={handleUpgrade}
            onDelete={handleDelete}
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

      <NewLeadModal open={addOpen} onOpenChange={setAddOpen} />
      <GenerateLinkModal open={linkOpen} onOpenChange={setLinkOpen} />
    </AdminPageShell>
  );
}
