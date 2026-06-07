"use client";

import { ChevronRight } from "lucide-react";

import { InstagramIcon } from "@/components/icons/social-icons";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function InstagramCTA() {
  const { translations: t } = useLanguage();

  return (
    <section className="bg-mist px-6 pb-20">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-ink to-ink/90 rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="relative">
          <InstagramIcon className="w-8 h-8 text-ruby mb-4" />
          <h2 className="font-display text-3xl md:text-5xl text-white mb-3">
            {t.instagramCta.title} <span className="text-ruby">{t.instagramCta.titleHighlight}</span>
          </h2>
          <p className="text-white/70 max-w-xl mb-6">{t.instagramCta.subtitle}</p>
          <button className="bg-brand-accent px-5 py-2.5 rounded-md font-semibold flex items-center gap-1 hover:brightness-110 transition">
            {t.instagramCta.bookACall} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

