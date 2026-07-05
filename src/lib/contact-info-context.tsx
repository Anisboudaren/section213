"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

import {
  toPublicContactInfo,
  type PublicContactInfo,
} from "@/lib/contact-info";
import type { SiteSettingsDto } from "@/lib/site-settings-defaults";

const ContactInfoContext = createContext<PublicContactInfo | null>(null);

type ContactInfoProviderProps = {
  settings: SiteSettingsDto;
  children: ReactNode;
};

export function ContactInfoProvider({ settings, children }: ContactInfoProviderProps) {
  const value = useMemo(() => toPublicContactInfo(settings), [settings]);

  return (
    <ContactInfoContext.Provider value={value}>{children}</ContactInfoContext.Provider>
  );
}

export function useContactInfo(): PublicContactInfo {
  const context = useContext(ContactInfoContext);
  if (!context) {
    throw new Error("useContactInfo must be used within ContactInfoProvider");
  }
  return context;
}
