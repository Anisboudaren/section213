"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { AccentColorTester } from "@/components/AccentColorTester";
import { PageTransitionLoader } from "@/components/PageTransitionLoader";
import { PublicLanguagePicker } from "@/components/PublicLanguagePicker";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccentColorProvider } from "@/lib/accent-color/AccentColorProvider";
import { AdminStoreProvider } from "@/lib/admin-store";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import type { SiteSettingsDto } from "@/lib/site-settings-defaults";

type ProvidersProps = {
  children: ReactNode;
  siteSettings: SiteSettingsDto;
};

export function Providers({ children, siteSettings }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AdminStoreProvider>
        <LanguageProvider>
          <AccentColorProvider
            initialAccentPresetId={siteSettings.accentPresetId}
            enabledAccentPresetIds={siteSettings.enabledAccentPresetIds}
          >
            <TooltipProvider>
              {children}
              <PageTransitionLoader />
              <PublicLanguagePicker />
              <AccentColorTester />
              <Toaster richColors position="top-right" />
            </TooltipProvider>
          </AccentColorProvider>
        </LanguageProvider>
      </AdminStoreProvider>
    </QueryClientProvider>
  );
}
