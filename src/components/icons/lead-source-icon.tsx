import Image from "next/image";
import { Globe, Mail, Phone, UserPlus, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { FacebookIcon, InstagramIcon } from "@/components/icons/social-icons";
import type { LeadSource } from "@/lib/types/admin";
import { cn } from "@/lib/utils";

const PNG_ICONS: Partial<Record<LeadSource, string>> = {
  instagram: "/icons/instagram (1).png",
  facebook: "/icons/facebook (1).png",
  whatsapp: "/icons/whatsapp (1).png",
  tiktok: "/icons/tiktok (1).png",
  google: "/icons/google.png",
};

const LUCIDE_ICONS: Partial<Record<LeadSource, LucideIcon>> = {
  website: Globe,
  referral: Users,
  cold: Phone,
  other: Mail,
};

type LeadSourceIconProps = {
  source: LeadSource;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const SIZE_CLASS = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-8 w-8",
} as const;

const SIZE_PX = {
  sm: 14,
  md: 20,
  lg: 32,
} as const;

export function LeadSourceIcon({ source, className, size = "sm" }: LeadSourceIconProps) {
  const sizeClass = SIZE_CLASS[size];
  const px = SIZE_PX[size];

  if (source === "instagram") {
    return (
      <InstagramIcon
        className={cn(sizeClass, "shrink-0 text-pink-600", className)}
        aria-hidden
      />
    );
  }

  if (source === "facebook") {
    return (
      <FacebookIcon
        className={cn(sizeClass, "shrink-0 text-blue-600", className)}
        aria-hidden
      />
    );
  }

  const png = PNG_ICONS[source];
  if (png) {
    return (
      <Image
        src={png}
        alt=""
        width={px}
        height={px}
        className={cn(sizeClass, "shrink-0 object-contain", className)}
        aria-hidden
      />
    );
  }

  const Lucide = LUCIDE_ICONS[source] ?? Mail;
  const color =
    source === "website"
      ? "text-blue-500"
      : source === "referral"
        ? "text-gold"
        : "text-muted-foreground";

  return <Lucide className={cn(sizeClass, "shrink-0", color, className)} aria-hidden />;
}
