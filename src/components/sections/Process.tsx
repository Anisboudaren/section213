import { Calendar, Package, Camera, Send } from "lucide-react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

const STEP_ICONS = [Calendar, Package, Camera, Send];

export function Process() {
  const { translations: t } = useLanguage();

  return (
    <section className="bg-ink text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-6xl text-center mb-2">
          {t.process.title} <span className="text-gold">{t.process.titleHighlight}</span>
        </h2>
        <div className="text-center mb-12">
          <button className="mt-6 bg-gold text-gold-foreground px-5 py-2 rounded-md text-sm font-semibold">
            {t.process.getStarted}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {t.process.steps.map((s, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <div
                key={s.title}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-gold/50 transition"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <span className="font-display text-3xl text-white/20">0{i + 1}</span>
                </div>
                <h3 className="font-display text-xl tracking-wider mb-2">{s.title.toUpperCase()}</h3>
                <p className="text-sm text-white/60">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
