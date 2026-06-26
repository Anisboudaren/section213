"use client";

import type { Lead, LeadStage } from "@/lib/types/admin";
import { LeadKanbanColumn } from "./LeadKanbanColumn";

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
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:snap-none">
      {STAGES.map((stage) => (
        <LeadKanbanColumn
          key={stage}
          stage={stage}
          leads={leads.filter((l) => l.stage === stage)}
          onLeadClick={onLeadClick}
        />
      ))}
    </div>
  );
}
