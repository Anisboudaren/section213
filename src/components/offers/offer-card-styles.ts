import { cn } from "@/lib/utils";

type OfferCardStyleOptions = {
  selected?: boolean;
  featured?: boolean;
  interactive?: boolean;
  className?: string;
};

export function offerCardClass({
  selected,
  featured,
  interactive = true,
  className,
}: OfferCardStyleOptions) {
  return cn(
    "group relative overflow-hidden rounded-xl border p-5 transition-all duration-200",
    interactive && "cursor-pointer",
    selected
      ? "border-ruby/50 bg-ink text-white shadow-lg shadow-ruby/10 ring-1 ring-ruby/30"
      : featured
        ? "border-ruby/25 bg-gradient-to-b from-ruby/[0.04] to-transparent hover:border-ruby/40 hover:shadow-md"
        : "border-ink/10 bg-gradient-to-b from-ink/[0.03] to-transparent hover:border-ink/20 hover:shadow-md",
    className,
  );
}

export function offerCardBadgeClass(selected?: boolean) {
  return cn(
    "absolute -top-2.5 right-4 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide",
    selected ? "bg-brand-accent text-ruby-foreground" : "bg-brand-accent text-ruby-foreground",
  );
}

export function offerCardDescriptionClass(selected?: boolean) {
  return cn("mt-2 line-clamp-2 text-sm", selected ? "text-white/70" : "text-muted-foreground");
}

export function offerCardFeatureClass(selected?: boolean) {
  return cn(
    "flex items-start gap-2 text-sm",
    selected ? "text-white/85" : "text-muted-foreground",
  );
}
