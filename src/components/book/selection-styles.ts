import { cn } from "@/lib/utils";

/** Shared selected / unselected styles for booking choice buttons */
export function bookingChoiceClass(selected: boolean, className?: string) {
  return cn(
    "cursor-pointer transition-colors",
    selected
      ? "border-ruby bg-ruby/10 text-ink ring-1 ring-ruby/35"
      : "border-border hover:border-ruby/40",
    className,
  );
}
