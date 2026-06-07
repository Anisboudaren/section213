"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function Stats() {
  const { translations: t } = useLanguage();

  return (
    <section className="bg-mist bg-dot-grid py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
        {t.stats.items.map((s) => (
          <div
            key={s.label}
            className="border border-ink/15 bg-paper rounded-xl p-6 text-center shadow-sm"
          >
            <div className="font-display text-3xl md:text-4xl text-ink mb-1">{s.value}</div>
            <div className="text-xs text-ink/70 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
