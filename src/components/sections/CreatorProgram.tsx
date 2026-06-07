"use client";

import { Check, ChevronRight } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

const TIERS = [
  {
    name: "Tier 1",
    price: "$1,800",
    features: ["4 Branding Videos / month", "Hooks + Scripts included", "Monthly Strategy Call"],
  },
  {
    name: "Tier 2",
    price: "$1,900",
    highlight: true,
    features: [
      "6 Branding Videos / month",
      "Hooks + Scripts included",
      "Bi-weekly Strategy Calls",
      "Priority Editing",
    ],
  },
  {
    name: "Tier 3",
    price: "$2,100",
    features: [
      "8 Branding Videos / month",
      "Custom Content Strategy",
      "Weekly Calls",
      "Full Editing Suite",
    ],
  },
];

export function CreatorProgram() {
  const { translations: t } = useLanguage();

  return (
    <section className="bg-ink text-white py-24 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-4xl md:text-6xl text-center mb-2">
          {t.creator.title} <span className="text-ruby">{t.creator.titleHighlight}</span>
        </h2>
        <p className="text-center text-white/60 mb-12 max-w-xl mx-auto">{t.creator.subtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl p-6 border ${
                tier.highlight
                  ? "bg-white/5 border-ruby/35 ring-1 ring-ruby/20"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <h3 className="font-display text-xl tracking-wider mb-2">{tier.name}</h3>
              <div className="text-3xl font-bold mb-6">{tier.price}</div>
              <ul className="space-y-2 mb-6 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-white/80">
                    <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 transition">
                {t.creator.exploreTiers} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
