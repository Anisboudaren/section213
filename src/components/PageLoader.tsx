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
        <div className="page-loader-bar h-full w-1/3 bg-ruby" />
      </div>

      <div className="relative flex h-32 w-32 items-center justify-center">
        <div className="page-loader-glow absolute inset-2 rounded-full" aria-hidden />

        <div
          className="absolute inset-0 rounded-full border border-ruby/15"
          aria-hidden
        />

        <div
          className="page-loader-ring absolute inset-0 rounded-full border-[3px] border-transparent border-t-ruby border-r-ruby/25"
          aria-hidden
        />

        <div className="page-loader-orbit absolute inset-0" aria-hidden>
          <span className="page-loader-dot" />
        </div>

        <span className="relative font-display text-[1.65rem] tracking-[0.22em]">
          <span className="text-ruby">s</span>
          <span className="text-ink/55">213</span>
        </span>
      </div>
    </div>
  );
}
