"use client";

import { format } from "date-fns";

import { LeadStageBadge } from "@/components/admin/LeadStageBadge";
import { SourceIcon } from "@/components/admin/SourceIcon";
import type { Lead } from "@/lib/types/admin";
import { cn } from "@/lib/utils";

type LeadCardProps = {
  lead: Lead;
  onClick: () => void;
};

export function LeadCard({ lead, onClick }: LeadCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full rounded-lg border border-ink/10 bg-card p-3 text-left shadow-sm transition-colors",
        "hover:border-gold/40 hover:bg-gold/5 min-h-11",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-ink truncate">{lead.name}</p>
        <LeadStageBadge stage={lead.stage} className="shrink-0 text-[10px]" />
      </div>
      {lead.company && (
        <p className="mt-0.5 text-xs text-muted-foreground truncate">{lead.company}</p>
      )}
      <div className="mt-2 flex items-center justify-between gap-2">
        <SourceIcon source={lead.source} />
        <span className="text-[10px] text-muted-foreground">
          {format(new Date(lead.createdAt), "MMM d")}
        </span>
      </div>
    </button>
  );
}
