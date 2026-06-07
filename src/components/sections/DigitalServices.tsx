"use client";

import { Bot, ChevronRight, Code2, Globe, Plug, Smartphone, Workflow } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

const SERVICE_ICONS = [Globe, Smartphone, Bot, Workflow, Plug, Code2];

export function DigitalServices() {
  const { translations: t } = useLanguage();

  return (
    <section id="digital" className="bg-mist bg-dot-grid py-24 px-6 border-t border-ink/5">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-6xl text-center text-ink mb-2">
          {t.digital.title} <span className="text-ruby">{t.digital.titleHighlight}</span>
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          {t.digital.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.digital.services.map((service, index) => {
            const Icon = SERVICE_ICONS[index];
            return (
              <div
                key={service.title}
                className="rounded-xl border border-ink/10 bg-paper p-6 hover:border-ink/40 transition"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-ink/8">
                  <Icon className="h-5 w-5 text-ink" />
                </div>
                <h3 className="font-display text-xl tracking-wider text-ink mb-2">
                  {service.title.toUpperCase()}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <button className="bg-brand-accent px-6 py-3 rounded-md font-semibold inline-flex items-center gap-2 hover:brightness-110 transition">
            {t.digital.discussBuild} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
