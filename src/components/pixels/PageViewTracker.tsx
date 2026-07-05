"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import type { PublicPixelConfig } from "@/lib/pixel-settings-defaults";
import { trackPageView } from "@/lib/pixel-events";

type PageViewTrackerInnerProps = {
  config: PublicPixelConfig;
};

function PageViewTrackerInner({ config }: PageViewTrackerInnerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    trackPageView();
  }, [pathname, searchParams, config]);

  return null;
}

type PageViewTrackerProps = {
  config: PublicPixelConfig;
};

export function PageViewTracker({ config }: PageViewTrackerProps) {
  if (config.testMode) return null;

  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner config={config} />
    </Suspense>
  );
}
