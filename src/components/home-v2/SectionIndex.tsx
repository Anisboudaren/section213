import { cn } from "@/lib/utils";

type SectionIndexProps = {
  index: string;
  className?: string;
};

export function SectionIndex({ index, className }: SectionIndexProps) {
  return (
    <p
      className={cn(
        "mb-4 font-display text-[11px] tracking-[0.4em] text-ruby sm:mb-5 sm:text-xs",
        className,
      )}
    >
      {index}
    </p>
  );
}
