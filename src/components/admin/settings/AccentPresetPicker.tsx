"use client";

import {
  ACCENT_PRESETS,
  getPresetSwatchStyle,
  type AccentPreset,
} from "@/lib/accent-presets";
import { cn } from "@/lib/utils";

type AccentPresetPickerProps = {
  value: string;
  onChange: (id: string) => void;
  enabledIds?: string[];
  mode?: "single" | "multi";
  selectedIds?: string[];
  onToggle?: (id: string) => void;
};

function PresetButton({
  preset,
  selected,
  onClick,
}: {
  preset: AccentPreset;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition",
        selected
          ? "border-ruby bg-ruby/10 ring-1 ring-ruby/35"
          : "border-border hover:border-ruby/30",
      )}
    >
      <span
        className="h-8 w-8 shrink-0 rounded-full border border-ink/10 shadow-inner"
        style={getPresetSwatchStyle(preset)}
        aria-hidden
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{preset.name}</span>
        <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {preset.kind === "gradient" ? "Gradient" : "Solid"}
        </span>
      </span>
    </button>
  );
}

export function AccentPresetPicker({
  value,
  onChange,
  enabledIds,
  mode = "single",
  selectedIds = [],
  onToggle,
}: AccentPresetPickerProps) {
  const pool = enabledIds?.length
    ? ACCENT_PRESETS.filter((p) => enabledIds.includes(p.id))
    : ACCENT_PRESETS;

  const solids = pool.filter((p) => p.kind === "solid");
  const gradients = pool.filter((p) => p.kind === "gradient");

  const renderGrid = (presets: AccentPreset[]) => (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {presets.map((preset) => (
        <PresetButton
          key={preset.id}
          preset={preset}
          selected={mode === "single" ? value === preset.id : selectedIds.includes(preset.id)}
          onClick={() => {
            if (mode === "single") onChange(preset.id);
            else onToggle?.(preset.id);
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {solids.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Solid
          </p>
          {renderGrid(solids)}
        </div>
      )}
      {gradients.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Gradient
          </p>
          {renderGrid(gradients)}
        </div>
      )}
    </div>
  );
}
