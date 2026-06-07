"use client";

import { Check, ChevronRight } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

const PACKAGES = [
  { name: "Package 01", price: "$6,500", features: ["2 Full Days On-Site", "Listings Shot", "Travel Included", "Edits Delivered in 14 Days"] },
  { name: "Package 02", price: "$7,500", badge: true, highlight: true, features: ["3 Full Days On-Site", "More Listings + Content", "Travel + Lodging", "Priority Edits"] },
  { name: "Package 03", price: "$8,500", features: ["4-5 Full Days On-Site", "Full Brand Production", "Travel + Lodging + Crew", "Same-Week Delivery"] },
];

export function Travel() {
  const { translations: t } = useLanguage();

  return (
    <section className="bg-ink text-white py-24 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-4xl md:text-6xl text-center mb-2">
          {t.travel.title} <span className="text-gold">{t.travel.titleHighlight}</span>
        </h2>
        <h3 className="font-display text-3xl md:text-5xl text-center mb-3">{t.travel.subtitle2}</h3>
        <p className="text-center text-white/60 mb-12">{t.travel.subtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PACKAGES.map((p) => (
            <div
              key={p.name}
              className={`rounded-xl p-6 border relative ${
                p.highlight ? "bg-gold/10 border-gold" : "bg-white/5 border-white/10"
              }`}
            >
              {p.badge && (
                <span className="absolute -top-3 right-4 bg-gold text-gold-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  {t.travel.bestValue}
                </span>
              )}
              <h3 className="font-display text-xl tracking-wider mb-2">{p.name}</h3>
              <div className="text-3xl font-bold mb-6">{p.price}</div>
              <ul className="space-y-2 mb-6 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-white/80">
                    <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 transition">
                {t.travel.explorePackage} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
