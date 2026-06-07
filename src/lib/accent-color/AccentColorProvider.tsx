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
  ACCENT_STORAGE_KEY,
  applyAccentPreset,
  DEFAULT_ACCENT_PRESET_ID,
  getAccentPreset,
  type AccentPreset,
} from "@/lib/accent-presets";

type AccentColorContextValue = {
  presetId: string;
  preset: AccentPreset;
  setPresetId: (id: string) => void;
};

const AccentColorContext = createContext<AccentColorContextValue | null>(null);

export function AccentColorProvider({ children }: { children: ReactNode }) {
  const [presetId, setPresetIdState] = useState(DEFAULT_ACCENT_PRESET_ID);
  const [ready, setReady] = useState(false);

  const preset = useMemo(() => getAccentPreset(presetId), [presetId]);

  useEffect(() => {
    const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
    const initial = getAccentPreset(stored ?? DEFAULT_ACCENT_PRESET_ID);
    setPresetIdState(initial.id);
    applyAccentPreset(initial);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    applyAccentPreset(preset);
    localStorage.setItem(ACCENT_STORAGE_KEY, preset.id);
  }, [preset, ready]);

  const setPresetId = useCallback((id: string) => {
    setPresetIdState(id);
  }, []);

  const value = useMemo(
    () => ({ presetId, preset, setPresetId }),
    [presetId, preset, setPresetId],
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
