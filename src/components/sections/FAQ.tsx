"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Minus, Phone, Plus } from "lucide-react";

import { useContactInfo } from "@/lib/contact-info-context";
import { telHref } from "@/lib/contact-info";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function FAQ() {
  const { translations: t } = useLanguage();
  const { contactPhone } = useContactInfo();
  const bookCta = t.homeV2.bookCta;
  const [active, setActive] = useState("general");
  const [open, setOpen] = useState<number | null>(0);

  const list = t.faq.items[active as keyof typeof t.faq.items] ?? t.faq.items.general;

  return (
    <section className="px-6 pt-10 pb-20 sm:pt-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-5xl text-center text-ink mb-10">
          {t.faq.title} <span className="text-ruby">{t.faq.titleHighlight}</span>
        </h2>
        {t.faq.categories.length > 1 ? (
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
        ) : null}
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
        <div className="mt-8 rounded-xl bg-ink p-6 text-white md:flex md:items-center md:justify-between md:gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display text-xl sm:text-2xl">{bookCta.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{bookCta.subtitle}</p>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row md:mt-0 md:shrink-0">
            <Link
              href="/book"
              className="bg-brand-accent inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-ruby-foreground transition hover:brightness-110"
            >
              {bookCta.cta}
              <ChevronRight className="h-4 w-4" />
            </Link>
            {contactPhone ? (
              <a
                href={telHref(contactPhone)}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/50"
              >
                <Phone className="h-4 w-4" />
                {contactPhone}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
