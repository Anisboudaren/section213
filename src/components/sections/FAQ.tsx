"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function FAQ() {
  const { translations: t } = useLanguage();
  const [active, setActive] = useState("general");
  const [open, setOpen] = useState<number | null>(0);

  const list = t.faq.items[active as keyof typeof t.faq.items] ?? t.faq.items.general;

  return (
    <section className="bg-mist bg-dot-grid py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-5xl text-center text-ink mb-10">
          {t.faq.title} <span className="text-ruby">{t.faq.titleHighlight}</span>
        </h2>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {t.faq.categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                active === c.id
                  ? "bg-ink text-white border-ink"
                  : "border-ink/20 text-ink/70 hover:border-ink"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {list.map((item, i) => (
            <div key={item.q} className="bg-white rounded-xl border border-ink/10">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-medium text-ink text-sm">{item.q}</span>
                {open === i ? <Minus className="w-4 h-4 text-ink" /> : <Plus className="w-4 h-4 text-ink" />}
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-sm text-ink/70">{item.a}</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 bg-ink text-white rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <div className="font-semibold text-sm">{t.faq.stillHaveQuestions}</div>
            <div className="text-xs text-white/60">{t.faq.teamReply}</div>
          </div>
          <button className="bg-brand-accent px-4 py-2 rounded-md text-sm font-semibold hover:brightness-110 transition">
            {t.faq.contactUs}
          </button>
        </div>
      </div>
    </section>
  );
}
