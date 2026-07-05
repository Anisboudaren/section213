"use client";

import { useEffect } from "react";

import { ClarityAnalytics } from "@/components/analytics/ClarityAnalytics";
import { PageViewTracker } from "@/components/pixels/PageViewTracker";
import { PixelScripts } from "@/components/pixels/PixelScripts";
import type { PublicPixelConfig } from "@/lib/pixel-settings-defaults";
import { setPixelConfigCache } from "@/lib/pixel-events";

type PixelProviderProps = {
  config: PublicPixelConfig;
  children: React.ReactNode;
};

export function PixelProvider({ config, children }: PixelProviderProps) {
  useEffect(() => {
    setPixelConfigCache(config);
  }, [config]);

  return (
    <>
      <PixelScripts config={config} />
      <ClarityAnalytics disabled={config.testMode} />
      <PageViewTracker config={config} />
      {children}
    </>
  );
}
