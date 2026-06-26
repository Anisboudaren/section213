"use client";

import { Palette } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ACCENT_PRESETS,
  getPresetSwatchStyle,
  type AccentPreset,
} from "@/lib/accent-presets";
import { useAccentColor } from "@/lib/accent-color/AccentColorProvider";
import { cn } from "@/lib/utils";

function PresetGrid({
  presets,
  presetId,
  onSelect,
}: {
  presets: AccentPreset[];
  presetId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
      {presets.map((option) => {
        const selected = option.id === presetId;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition",
              selected
                ? "border-ruby bg-ruby/10 ring-1 ring-ruby/35"
                : "border-border hover:border-ruby/30",
            )}
          >
            <span
              className="h-8 w-8 shrink-0 rounded-full border border-ink/10 shadow-inner"
              style={getPresetSwatchStyle(option)}
              aria-hidden
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-ink">{option.name}</span>
              <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {option.kind === "gradient" ? "Gradient" : "Solid"}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function AccentColorTester() {
  const pathname = usePathname();
  const { presetId, setPresetId, enabledPresetIds } = useAccentColor();
  const [open, setOpen] = useState(false);

  const allowed = ACCENT_PRESETS.filter((p) =>
    enabledPresetIds.length ? enabledPresetIds.includes(p.id) : true,
  );
  const solidPresets = allowed.filter((p) => p.kind === "solid");
  const gradientPresets = allowed.filter((p) => p.kind === "gradient");

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-50 inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-paper/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink shadow-md backdrop-blur-sm transition hover:border-ruby/40 hover:text-ruby"
        aria-label="Test accent colors"
      >
        <Palette className="h-3.5 w-3.5 text-ruby" />
        Accent
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85dvh] max-w-sm gap-4 overflow-y-auto border-ruby/20 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl tracking-wide text-ink">
              Accent tester
            </DialogTitle>
            <DialogDescription className="text-sm">
              Preview accent options enabled for your site. Changes here are temporary in this
              browser — set the live accent in Admin → Settings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Solid accents
              </p>
              <PresetGrid presets={solidPresets} presetId={presetId} onSelect={setPresetId} />
            </div>

            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Gradient accents
              </p>
              <PresetGrid presets={gradientPresets} presetId={presetId} onSelect={setPresetId} />
            </div>

            <div className="rounded-xl border border-border bg-mist/50 p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Preview
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-ruby">Headline accent</span>
                <span className="rounded-md bg-brand-accent px-3 py-1.5 text-xs font-semibold shadow-sm">
                  CTA button
                </span>
              </div>
            </div>
          </div>

          <Button variant="ruby" className="w-full" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
