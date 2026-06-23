import { cn } from "@/lib/utils";
import type { LeadStage } from "@/lib/types/admin";
import { adminT } from "@/lib/i18n/admin-en";
import { Badge } from "@/components/ui/badge";

const stageStyles: Record<LeadStage, string> = {
  new: "bg-muted text-muted-foreground border-muted-foreground/20",
  contacted: "bg-amber-100 text-amber-800 border-amber-200",
  qualified: "bg-blue-100 text-blue-800 border-blue-200",
  proposal_sent: "bg-purple-100 text-purple-800 border-purple-200",
  won: "bg-green-100 text-green-800 border-green-200",
  lost: "bg-red-100 text-red-800 border-red-200",
};

type LeadStageBadgeProps = {
  stage: LeadStage;
  className?: string;
};

export function LeadStageBadge({ stage, className }: LeadStageBadgeProps) {
  return (
    <Badge variant="outline" className={cn("font-medium", stageStyles[stage], className)}>
      {adminT(`leads.stages.${stage}` as Parameters<typeof adminT>[0])}
    </Badge>
  );
}
