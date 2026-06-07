"use client";

import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/icons/social-icons";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function Footer() {
  const { translations: t } = useLanguage();

  return (
    <footer className="bg-ink text-white py-12 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-ruby font-display text-2xl tracking-wider">213</span>
            <div className="leading-none">
              <div className="font-display text-xl tracking-wider">SECTION</div>
              <div className="text-[10px] tracking-[0.3em] text-ruby">213</div>
            </div>
          </div>
          <p className="text-xs text-white/50">{t.footer.tagline}</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-gold mb-3">{t.footer.services}</div>
          <ul className="space-y-2 text-sm text-white/70">
            {t.footer.serviceItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-gold mb-3">{t.footer.company}</div>
          <ul className="space-y-2 text-sm text-white/70">
            {t.footer.companyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-gold mb-3">{t.footer.follow}</div>
          <div className="flex gap-3">
            <InstagramIcon className="w-5 h-5 text-white/70 hover:text-ruby transition" />
            <FacebookIcon className="w-5 h-5 text-white/70 hover:text-ruby transition" />
            <YoutubeIcon className="w-5 h-5 text-white/70 hover:text-ruby transition" />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 text-xs text-white/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>{t.footer.rights}</div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
          <LanguageSwitcher />
          <div>(704) 832-4498 · hello@section213.com</div>
        </div>
      </div>
    </footer>
  );
}

