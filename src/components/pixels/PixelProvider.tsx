"use client";

import { useEffect } from "react";

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
      <PageViewTracker config={config} />
      {children}
    </>
  );
}
