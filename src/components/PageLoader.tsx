import { cn } from "@/lib/utils";

type PageLoaderProps = {
  className?: string;
};

export function PageLoader({ className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-paper/35 backdrop-blur-[1.5px]" />

      <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-ink/5">
        <div className="page-loader-bar h-full w-1/3 bg-brand-accent" />
      </div>

      <div className="relative flex h-28 w-28 items-center justify-center">
        <div
          className="page-loader-ring absolute inset-0 rounded-full border-[3px] border-ink/10 border-t-brand-accent"
          aria-hidden
        />
        <span className="relative font-display text-2xl tracking-[0.2em] text-ink/80">
          s213
        </span>
      </div>
    </div>
  );
}
