export type AccentPresetKind = "solid" | "gradient";

export type AccentPreset = {
  id: string;
  name: string;
  kind: AccentPresetKind;
  ruby: string;
  rubyForeground: string;
  /** When set, used for CTAs via `.bg-brand-accent` */
  gradient?: string;
};

export const ACCENT_STORAGE_KEY = "section213-accent-preset";

export const DEFAULT_ACCENT_PRESET_ID = "midnight-ruby";

export const ACCENT_PRESETS: AccentPreset[] = [
  // — Solid —
  {
    id: "monochrome",
    name: "Monochrome",
    kind: "solid",
    ruby: "oklch(1 0 0)",
    rubyForeground: "oklch(0.08 0 0)",
  },
  {
    id: "vivid-red",
    name: "Vivid red",
    kind: "solid",
    ruby: "oklch(0.58 0.26 27)",
    rubyForeground: "oklch(0.99 0.01 27)",
  },
  {
    id: "bright-red",
    name: "Bright red",
    kind: "solid",
    ruby: "oklch(0.62 0.28 25)",
    rubyForeground: "oklch(0.99 0.01 25)",
  },
  {
    id: "deep-red",
    name: "Deep red",
    kind: "solid",
    ruby: "oklch(0.48 0.22 25)",
    rubyForeground: "oklch(0.98 0.01 25)",
  },
  {
    id: "crimson",
    name: "Crimson",
    kind: "solid",
    ruby: "oklch(0.55 0.24 20)",
    rubyForeground: "oklch(0.99 0.01 20)",
  },
  {
    id: "burgundy",
    name: "Burgundy",
    kind: "solid",
    ruby: "oklch(0.42 0.18 22)",
    rubyForeground: "oklch(0.98 0.01 22)",
  },
  {
    id: "coral",
    name: "Coral",
    kind: "solid",
    ruby: "oklch(0.65 0.20 35)",
    rubyForeground: "oklch(0.12 0.02 35)",
  },
  {
    id: "gold",
    name: "Gold",
    kind: "solid",
    ruby: "oklch(0.72 0.14 85)",
    rubyForeground: "oklch(0.18 0.03 85)",
  },
  {
    id: "champagne",
    name: "Champagne",
    kind: "solid",
    ruby: "oklch(0.82 0.10 95)",
    rubyForeground: "oklch(0.22 0.02 95)",
  },
  {
    id: "copper",
    name: "Copper",
    kind: "solid",
    ruby: "oklch(0.58 0.14 55)",
    rubyForeground: "oklch(0.99 0.01 55)",
  },
  // — Gradients (awards / luxury agency style) —
  {
    id: "sunset-ember",
    name: "Sunset ember",
    kind: "gradient",
    ruby: "oklch(0.58 0.26 27)",
    rubyForeground: "oklch(0.99 0.01 27)",
    gradient: "linear-gradient(135deg, oklch(0.52 0.26 22), oklch(0.66 0.22 42))",
  },
  {
    id: "luxury-wine",
    name: "Luxury wine",
    kind: "gradient",
    ruby: "oklch(0.52 0.24 27)",
    rubyForeground: "oklch(0.99 0.01 27)",
    gradient: "linear-gradient(145deg, oklch(0.36 0.14 20), oklch(0.54 0.26 28))",
  },
  {
    id: "rose-gold",
    name: "Rose gold",
    kind: "gradient",
    ruby: "oklch(0.62 0.14 30)",
    rubyForeground: "oklch(0.16 0.02 30)",
    gradient: "linear-gradient(135deg, oklch(0.78 0.10 55), oklch(0.62 0.16 25))",
  },
  {
    id: "champagne-silk",
    name: "Champagne silk",
    kind: "gradient",
    ruby: "oklch(0.72 0.12 85)",
    rubyForeground: "oklch(0.18 0.03 85)",
    gradient: "linear-gradient(135deg, oklch(0.90 0.07 98), oklch(0.70 0.14 78))",
  },
  {
    id: "obsidian-flare",
    name: "Obsidian flare",
    kind: "gradient",
    ruby: "oklch(0.58 0.26 27)",
    rubyForeground: "oklch(0.99 0.01 27)",
    gradient: "linear-gradient(135deg, oklch(0.18 0.02 27), oklch(0.60 0.27 27))",
  },
  {
    id: "coral-pulse",
    name: "Coral pulse",
    kind: "gradient",
    ruby: "oklch(0.62 0.24 30)",
    rubyForeground: "oklch(0.99 0.01 30)",
    gradient: "linear-gradient(120deg, oklch(0.58 0.26 22), oklch(0.68 0.20 38))",
  },
  {
    id: "amber-glow",
    name: "Amber glow",
    kind: "gradient",
    ruby: "oklch(0.62 0.22 55)",
    rubyForeground: "oklch(0.14 0.03 55)",
    gradient: "linear-gradient(135deg, oklch(0.72 0.16 72), oklch(0.56 0.26 27))",
  },
  {
    id: "platinum-edge",
    name: "Platinum edge",
    kind: "gradient",
    ruby: "oklch(0.55 0.02 270)",
    rubyForeground: "oklch(0.12 0 0)",
    gradient: "linear-gradient(135deg, oklch(0.82 0.01 270), oklch(0.52 0.02 270))",
  },
  {
    id: "magenta-neon",
    name: "Magenta neon",
    kind: "gradient",
    ruby: "oklch(0.58 0.28 330)",
    rubyForeground: "oklch(0.99 0.01 330)",
    gradient: "linear-gradient(135deg, oklch(0.52 0.28 12), oklch(0.58 0.26 330))",
  },
  {
    id: "bronze-forge",
    name: "Bronze forge",
    kind: "gradient",
    ruby: "oklch(0.55 0.14 50)",
    rubyForeground: "oklch(0.99 0.01 50)",
    gradient: "linear-gradient(135deg, oklch(0.50 0.12 55), oklch(0.44 0.18 38))",
  },
  {
    id: "midnight-ruby",
    name: "Midnight ruby",
    kind: "gradient",
    ruby: "oklch(0.56 0.25 27)",
    rubyForeground: "oklch(0.99 0.01 27)",
    gradient: "linear-gradient(160deg, oklch(0.28 0.10 27), oklch(0.58 0.26 27) 55%, oklch(0.48 0.22 18))",
  },
  {
    id: "pearl-blush",
    name: "Pearl blush",
    kind: "gradient",
    ruby: "oklch(0.58 0.18 25)",
    rubyForeground: "oklch(0.99 0.01 25)",
    gradient: "linear-gradient(135deg, oklch(0.94 0.02 25), oklch(0.58 0.24 27))",
  },
];

export function getAccentPreset(id: string): AccentPreset {
  return ACCENT_PRESETS.find((p) => p.id === id) ?? ACCENT_PRESETS[0];
}

export function applyAccentPreset(preset: AccentPreset) {
  const root = document.documentElement;
  root.dataset.accentPreset = preset.id;
  root.style.setProperty("--ruby", preset.ruby);
  root.style.setProperty("--ruby-foreground", preset.rubyForeground);
  root.style.setProperty("--gold", preset.ruby);
  root.style.setProperty("--gold-foreground", preset.rubyForeground);

  if (preset.gradient) {
    root.style.setProperty("--accent-gradient", preset.gradient);
  } else {
    root.style.removeProperty("--accent-gradient");
  }
}

export function getPresetSwatchStyle(preset: AccentPreset): { background?: string; backgroundColor?: string } {
  if (preset.id === "monochrome") {
    return { background: "linear-gradient(135deg, oklch(0.08 0 0), oklch(1 0 0))" };
  }
  if (preset.gradient) {
    return { background: preset.gradient };
  }
  return { backgroundColor: preset.ruby };
}
