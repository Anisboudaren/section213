import Image from "next/image";

import { cn } from "@/lib/utils";
import { getAvatarColorClass, getInitials } from "@/lib/utils/client-helpers";

type ClientAvatarProps = {
  name: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-12 text-sm",
  md: "size-14 text-lg",
  lg: "size-24 text-xl sm:size-28",
} as const;

export function ClientAvatar({
  name,
  logoUrl,
  size = "md",
  className,
}: ClientAvatarProps) {
  const label = name || "?";

  if (logoUrl) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full border border-border/60 bg-muted",
          sizeClasses[size],
          className,
        )}
      >
        <Image
          src={logoUrl}
          alt={label}
          fill
          className="object-cover"
          unoptimized={logoUrl.includes("blob.vercel-storage.com")}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-display",
        sizeClasses[size],
        getAvatarColorClass(label),
        className,
      )}
    >
      {getInitials(label)}
    </div>
  );
}
