"use client";

import { Languages } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LOCALE_LABELS, type Locale } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

type LanguagePickerDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When true, user must pick a language before closing */
  requireChoice?: boolean;
};

export function LanguagePickerDialog({
  open: controlledOpen,
  onOpenChange,
  requireChoice = false,
}: LanguagePickerDialogProps) {
  const { locale, setLocale, translations, hasChosenLocale, ready } = useLanguage();
  const [internalOpen, setInternalOpen] = useState(false);
  const [pendingLocale, setPendingLocale] = useState<Locale>(locale);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const closeDialog = () => {
    if (isControlled) {
      onOpenChange?.(false);
    } else {
      setInternalOpen(false);
    }
  };

  const setOpen = (value: boolean) => {
    if (requireChoice && !value && !hasChosenLocale) return;
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };

  useEffect(() => {
    if (!ready || isControlled) return;
    if (!hasChosenLocale) {
      setInternalOpen(true);
    } else {
      setInternalOpen(false);
    }
  }, [ready, hasChosenLocale, isControlled]);

  useEffect(() => {
    setPendingLocale(locale);
  }, [locale, open]);

  const handleContinue = () => {
    setLocale(pendingLocale);
    closeDialog();
  };

  const t = translations.language;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-h-[85dvh] w-[calc(100%-1.5rem)] max-w-sm gap-3 overflow-y-auto border-gold/20 p-4 sm:max-w-md sm:gap-4 sm:p-6 sm:rounded-2xl"
        onPointerDownOutside={(e) => requireChoice && !hasChosenLocale && e.preventDefault()}
        onEscapeKeyDown={(e) => requireChoice && !hasChosenLocale && e.preventDefault()}
        hideClose={requireChoice && !hasChosenLocale}
      >
        <DialogHeader className="items-center space-y-1 text-center sm:text-center">
          <div className="mx-auto mb-1 flex h-9 w-9 items-center justify-center rounded-full bg-gold/15 sm:mb-2 sm:h-11 sm:w-11">
            <Languages className="h-4 w-4 text-gold sm:h-5 sm:w-5" />
          </div>
          <DialogTitle className="font-display text-xl tracking-wide text-ink sm:text-2xl">
            {t.pickerTitle}
          </DialogTitle>
          <DialogDescription className="text-xs leading-relaxed sm:text-sm">
            {t.pickerSubtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 sm:mt-1 sm:gap-3">
          {(["en", "fr"] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setPendingLocale(code)}
              className={cn(
                "rounded-lg border px-3 py-3 text-left transition sm:rounded-xl sm:px-4 sm:py-4",
                pendingLocale === code
                  ? "border-gold bg-gold/10 ring-1 ring-gold/40"
                  : "border-border hover:border-gold/30",
              )}
            >
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
                {code === "en" ? "EN" : "FR"}
              </p>
              <p className="mt-0.5 font-display text-base tracking-wide text-ink sm:mt-1 sm:text-lg">
                {LOCALE_LABELS[code]}
              </p>
            </button>
          ))}
        </div>

        <Button variant="gold" size="sm" className="mt-2 w-full sm:mt-4 sm:h-9" onClick={handleContinue}>
          {t.continue}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
