import { cn } from "@/lib/utils";

/** Shared selected / unselected styles for booking choice buttons */
export function bookingChoiceClass(selected: boolean, className?: string) {
  return cn(
    "cursor-pointer transition-colors rounded-lg border p-4 text-start flex flex-col gap-1 min-h-[4.5rem]",
    selected
      ? "border-ruby bg-ruby/10 text-ink ring-1 ring-ruby/35"
      : "border-border hover:border-ruby/40",
    className,
  );
}

export const selectionButtonClass = cn(
  "cursor-pointer transition-colors rounded-lg border p-4 text-start flex flex-col gap-1 min-h-[4.5rem] border-border hover:border-ruby/40",
);
