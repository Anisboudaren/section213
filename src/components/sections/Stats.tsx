"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function Stats() {
  const { translations: t } = useLanguage();

  return (
    <section className="bg-secondary py-20 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
        {t.stats.items.map((s) => (
          <div
            key={s.label}
            className="bg-gradient-to-br from-gold/30 to-gold/5 border border-gold/40 rounded-xl p-6 text-center"
          >
            <div className="font-display text-3xl md:text-4xl text-ink mb-1">{s.value}</div>
            <div className="text-xs text-ink/70 uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
