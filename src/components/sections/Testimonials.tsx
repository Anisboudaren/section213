"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function Testimonials() {
  const { translations: t } = useLanguage();
  const [index, setIndex] = useState(0);
  const visible = 4;

  return (
    <section className="bg-secondary py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-5xl text-center text-ink mb-12">
          {t.testimonials.title} <span className="text-gold">{t.testimonials.titleHighlight}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.testimonials.items.slice(0, visible).map((item) => (
            <div key={item.name} className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm text-ink/80 leading-relaxed mb-5">&ldquo;{item.quote}&rdquo;</p>
              <div className="text-sm font-semibold text-ink">{item.name}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setIndex(Math.max(0, index - 1))}
            className="w-9 h-9 rounded-full border border-ink/20 flex items-center justify-center hover:bg-ink hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIndex(Math.min(t.testimonials.items.length - visible, index + 1))}
            className="w-9 h-9 rounded-full border border-ink/20 flex items-center justify-center hover:bg-ink hover:text-white transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
