"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { AccentColorTester } from "@/components/AccentColorTester";
import { PublicLanguagePicker } from "@/components/PublicLanguagePicker";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccentColorProvider } from "@/lib/accent-color/AccentColorProvider";
import { AdminStoreProvider } from "@/lib/admin-store";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AdminStoreProvider>
        <LanguageProvider>
          <AccentColorProvider>
            <TooltipProvider>
              {children}
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
