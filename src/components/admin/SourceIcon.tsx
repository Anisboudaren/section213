import { LeadSourceIcon } from "@/components/icons/lead-source-icon";
import { cn } from "@/lib/utils";
import type { LeadSource } from "@/lib/types/admin";
import { adminT } from "@/lib/i18n/admin-en";

type SourceIconProps = {
  source: LeadSource;
  showLabel?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function SourceIcon({ source, showLabel = true, className, size = "sm" }: SourceIconProps) {
  const label = adminT(`leads.sources.${source}` as Parameters<typeof adminT>[0]);

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs", className)}>
      <LeadSourceIcon source={source} size={size} />
      {showLabel && <span className="text-muted-foreground">{label}</span>}
    </span>
  );
}
