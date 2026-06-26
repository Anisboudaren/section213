import { SourceIcon } from "@/components/admin/SourceIcon";
import type { LeadSource } from "@/lib/types/admin";
import { leadSourceOptions } from "@/lib/schemas/lead-schema";
import { cn } from "@/lib/utils";

type LeadSourceBadgeProps = {
  source: LeadSource;
  showLabel?: boolean;
  className?: string;
};

export function LeadSourceBadge({ source, showLabel = true, className }: LeadSourceBadgeProps) {
  const option = leadSourceOptions.find((o) => o.value === source);
  const label = option?.label ?? source;

  if (!showLabel) {
    return <SourceIcon source={source} showLabel={false} className={className} />;
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <SourceIcon source={source} showLabel={false} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </span>
  );
}
