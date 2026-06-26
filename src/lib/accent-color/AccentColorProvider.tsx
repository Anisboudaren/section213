"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  applyAccentPreset,
  DEFAULT_ACCENT_PRESET_ID,
  getAccentPreset,
  type AccentPreset,
} from "@/lib/accent-presets";
import type { SiteSettingsDto } from "@/lib/site-settings-defaults";

type AccentColorContextValue = {
  presetId: string;
  preset: AccentPreset;
  enabledPresetIds: string[];
  setPresetId: (id: string) => void;
};

const AccentColorContext = createContext<AccentColorContextValue | null>(null);

type AccentColorProviderProps = {
  children: ReactNode;
  initialAccentPresetId?: string;
  enabledAccentPresetIds?: string[];
};

export function AccentColorProvider({
  children,
  initialAccentPresetId = DEFAULT_ACCENT_PRESET_ID,
  enabledAccentPresetIds = [],
}: AccentColorProviderProps) {
  const [presetId, setPresetIdState] = useState(initialAccentPresetId);
  const [enabledIds, setEnabledIds] = useState(enabledAccentPresetIds);

  useEffect(() => {
    setPresetIdState(initialAccentPresetId);
    setEnabledIds(enabledAccentPresetIds);
  }, [initialAccentPresetId, enabledAccentPresetIds]);

  const preset = useMemo(() => getAccentPreset(presetId), [presetId]);

  useEffect(() => {
    applyAccentPreset(preset);
  }, [preset]);

  const setPresetId = useCallback((id: string) => {
    setPresetIdState(id);
  }, []);

  const value = useMemo(
    () => ({
      presetId,
      preset,
      enabledPresetIds: enabledIds,
      setPresetId,
    }),
    [presetId, preset, enabledIds, setPresetId],
  );

  return <AccentColorContext.Provider value={value}>{children}</AccentColorContext.Provider>;
}

export function useAccentColor() {
  const ctx = useContext(AccentColorContext);
  if (!ctx) {
    throw new Error("useAccentColor must be used within AccentColorProvider");
  }
  return ctx;
}

export function useSiteSettingsAccent(settings: Pick<SiteSettingsDto, "accentPresetId" | "enabledAccentPresetIds">) {
  return {
    initialAccentPresetId: settings.accentPresetId,
    enabledAccentPresetIds: settings.enabledAccentPresetIds,
  };
}
