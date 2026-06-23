import {
  Globe,
  Camera,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Share2,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LeadSource } from "@/lib/types/admin";
import { adminT } from "@/lib/i18n/admin-en";

const sourceConfig: Record<LeadSource, { icon: LucideIcon; color: string }> = {
  instagram: { icon: Camera, color: "text-pink-600" },
  tiktok: { icon: MessageCircle, color: "text-ink" },
  facebook: { icon: Share2, color: "text-blue-600" },
  google: { icon: Search, color: "text-green-600" },
  referral: { icon: UserPlus, color: "text-gold" },
  website: { icon: Globe, color: "text-blue-500" },
  cold: { icon: Phone, color: "text-muted-foreground" },
  other: { icon: Mail, color: "text-muted-foreground" },
};

type SourceIconProps = {
  source: LeadSource;
  showLabel?: boolean;
  className?: string;
};

export function SourceIcon({ source, showLabel = true, className }: SourceIconProps) {
  const { icon: Icon, color } = sourceConfig[source];
  const label = adminT(`leads.sources.${source}` as Parameters<typeof adminT>[0]);

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs", className)}>
      <Icon className={cn("h-3.5 w-3.5 shrink-0", color)} aria-hidden />
      {showLabel && <span className="text-muted-foreground">{label}</span>}
    </span>
  );
}
