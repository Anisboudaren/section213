"use client";

import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

const PACKAGE_PRICES = ["$750", "$1,100", "$1,425"];

export function Pricing() {
  const { translations: t } = useLanguage();

  return (
    <section id="services" className="bg-ink text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-6xl text-center mb-2">
          {t.pricing.title} <span className="text-ruby">{t.pricing.titleHighlight}</span>
        </h2>
        <p className="text-center text-white/60 mb-12 max-w-xl mx-auto">{t.pricing.subtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.pricing.packages.map((p, index) => {
            const highlight = index === 2;
            const badge =
              index === 1 ? t.pricing.popular : index === 2 ? t.pricing.bestValue : undefined;
            const price =
              "price" in p && p.price ? p.price : PACKAGE_PRICES[index] ?? "CUSTOM";

            return (
              <div
                key={p.name}
                className={`rounded-xl p-6 border transition relative ${
                  highlight
                    ? "bg-white/5 border-ruby/40 ring-1 ring-ruby/25 scale-[1.02]"
                    : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
              >
                {badge && (
                  <span className="absolute -top-3 right-4 bg-brand-accent text-xs font-semibold px-3 py-1 rounded-full">
                    {badge}
                  </span>
                )}
                <h3 className="font-display text-2xl tracking-wider mb-3">{p.name}</h3>
                <div className="text-3xl font-bold mb-6">{price}</div>
                <ul className="space-y-2 mb-6 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-white/80">
                      <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/book"
                  className={`w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-1 transition ${
                    highlight
                      ? "bg-brand-accent hover:brightness-110"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {t.pricing.explorePackage} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

