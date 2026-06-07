"use client";

import { Globe } from "lucide-react";
import { useState } from "react";

import { LanguagePickerDialog } from "@/components/LanguagePickerDialog";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { LOCALE_LABELS } from "@/lib/i18n/types";

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const { locale, translations } = useLanguage();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 transition hover:border-gold/40 hover:text-gold"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{translations.language.switcherLabel}:</span>
        <span className="text-white">{LOCALE_LABELS[locale]}</span>
      </button>
      <LanguagePickerDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
