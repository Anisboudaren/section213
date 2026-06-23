import Image from "next/image";

import { cn } from "@/lib/utils";

export const LOGO_PATH = "/logo/main logo sectoin 213.png";

type Section213LogoProps = {
  className?: string;
  /** Nav / header — default height */
  size?: "sm" | "md" | "lg";
  priority?: boolean;
};

const SIZE_CLASS = {
  sm: "h-7 w-auto sm:h-8",
  md: "h-8 w-auto sm:h-9 md:h-10",
  lg: "h-10 w-auto sm:h-11 md:h-12",
} as const;

export function Section213Logo({
  className,
  size = "md",
  priority = false,
}: Section213LogoProps) {
  return (
    <Image
      src={LOGO_PATH}
      alt="Section 213"
      width={640}
      height={200}
      priority={priority}
      className={cn("object-contain object-left", SIZE_CLASS[size], className)}
    />
  );
}
