"use client";

import type { Lead, LeadStage } from "@/lib/types/admin";
import { adminT } from "@/lib/i18n/admin-en";
import { LeadCard } from "./LeadCard";

const STAGES: LeadStage[] = [
  "new",
  "contacted",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
];

type LeadKanbanProps = {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
};

export function LeadKanban({ leads, onLeadClick }: LeadKanbanProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STAGES.map((stage) => {
        const columnLeads = leads.filter((l) => l.stage === stage);
        return (
          <div
            key={stage}
            className="flex w-72 shrink-0 flex-col rounded-lg border border-ink/10 bg-muted/20"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-3 py-2">
              <h3 className="text-sm font-medium">
                {adminT(`leads.stages.${stage}` as Parameters<typeof adminT>[0])}
              </h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {columnLeads.length}
              </span>
            </div>
            <div className="flex flex-col gap-2 p-2 min-h-[120px]">
              {columnLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} onClick={() => onLeadClick(lead)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
