"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

const NAMES = [
  "Lukas Group", "Crable Group", "Mountain Realty", "Angela Davis",
  "Hive Group", "Drew Wilson", "Listing & Friends",
  "Eli Co.", "Wilson Realty", "Lara Co.", "Riverstone Homes",
  "Cove Realty", "Davis Group", "Thorne Media",
];

export function Trusted() {
  const { translations: t } = useLanguage();

  return (
    <section className="bg-ink text-white py-24 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-2xl md:text-3xl text-center tracking-widest mb-12">
          {t.trusted.title} <span className="text-gold">{t.trusted.titleHighlight}</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {NAMES.map((n) => (
            <div
              key={n}
              className="border border-white/10 bg-white/5 rounded-lg aspect-[3/2] flex items-center justify-center text-center text-xs text-white/60 px-2 hover:border-gold/40 transition"
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
