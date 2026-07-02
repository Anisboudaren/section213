import { cn } from "@/lib/utils";

type PageLoaderProps = {
  className?: string;
};

export function PageLoader({ className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[9999] flex items-start justify-center",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-0 bg-paper/35 backdrop-blur-[1.5px]" />

      <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden bg-ink/5">
        <div className="page-loader-bar h-full w-1/3 bg-brand-accent" />
      </div>

      <div className="relative mt-[18vh] flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="page-loader-dot h-2 w-2 rounded-full bg-ruby" />
          <span className="page-loader-dot page-loader-dot--delay-1 h-2 w-2 rounded-full bg-ruby/70" />
          <span className="page-loader-dot page-loader-dot--delay-2 h-2 w-2 rounded-full bg-ruby/45" />
        </div>
        <span className="font-display text-sm tracking-[0.35em] text-ink/70">213</span>
      </div>
    </div>
  );
}
