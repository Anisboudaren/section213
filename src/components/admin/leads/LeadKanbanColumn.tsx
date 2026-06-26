"use client";

import type { Lead, LeadStage } from "@/lib/types/admin";
import { adminT } from "@/lib/i18n/admin-en";
import { LeadCard } from "./LeadCard";

type LeadKanbanColumnProps = {
  stage: LeadStage;
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
};

export function LeadKanbanColumn({ stage, leads, onLeadClick }: LeadKanbanColumnProps) {
  return (
    <div className="flex w-[85vw] shrink-0 snap-center flex-col rounded-lg border border-ink/10 bg-muted/20 sm:w-72 md:w-64 lg:w-72">
      <div className="flex items-center justify-between border-b border-ink/10 px-3 py-2">
        <h3 className="text-sm font-medium">
          {adminT(`leads.stages.${stage}` as Parameters<typeof adminT>[0])}
        </h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {leads.length}
        </span>
      </div>
      <div className="flex max-h-[calc(100vh-16rem)] flex-col gap-2 overflow-y-auto p-2 min-h-[120px] md:max-h-[calc(100vh-14rem)]">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
        ))}
      </div>
    </div>
  );
}
