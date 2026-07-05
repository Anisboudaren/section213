"use client";

import { ExternalLink } from "lucide-react";

import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/icons/social-icons";
import { Section213Logo } from "@/components/Section213Logo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useContactInfo } from "@/lib/contact-info-context";
import {
  buildSocialLinks,
  mailtoHref,
  telHref,
  type SocialLink,
} from "@/lib/contact-info";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

function SocialIcon({ kind, className }: { kind: SocialLink["kind"]; className?: string }) {
  switch (kind) {
    case "instagram":
      return <InstagramIcon className={className} />;
    case "facebook":
      return <FacebookIcon className={className} />;
    case "youtube":
      return <YoutubeIcon className={className} />;
    default:
      return <ExternalLink className={className} />;
  }
}

export function Footer() {
  const { translations: t, locale } = useLanguage();
  const info = useContactInfo();
  const { contactPhone, contactEmail, contactAddress, contactCity, mapsUrl } = info;
  const hours =
    locale === "fr"
      ? info.contactHoursFr
      : locale === "ar"
        ? (info.contactHoursEn ?? t.contact.hoursDefault)
        : info.contactHoursEn;
  const socials = buildSocialLinks(info);
  const addressLine = [contactAddress, contactCity].filter(Boolean).join(", ");

  return (
    <footer className="bg-ink text-white py-12 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-4">
            <Section213Logo size="lg" />
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
          <div className="text-xs uppercase tracking-widest text-gold mb-3">{t.footer.contact}</div>
          <ul className="space-y-2 text-sm text-white/70">
            {contactPhone ? (
              <li>
                <a href={telHref(contactPhone)} className="hover:text-white transition-colors">
                  {contactPhone}
                </a>
              </li>
            ) : null}
            {contactEmail ? (
              <li>
                <a href={mailtoHref(contactEmail)} className="hover:text-white transition-colors">
                  {contactEmail}
                </a>
              </li>
            ) : null}
            {addressLine ? (
              <li>
                {mapsUrl ? (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    {addressLine}
                  </a>
                ) : (
                  addressLine
                )}
              </li>
            ) : null}
            {hours ? <li>{hours}</li> : null}
          </ul>
          {socials.length > 0 ? (
            <div className="mt-5">
              <div className="text-xs uppercase tracking-widest text-gold mb-3">{t.footer.follow}</div>
              <div className="flex flex-wrap gap-3">
                {socials.map((link) => (
                  <a
                    key={link.id}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="text-white/70 hover:text-ruby transition"
                  >
                    <SocialIcon kind={link.kind} className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 text-xs text-white/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>{t.footer.rights}</div>
        <LanguageSwitcher />
      </div>
    </footer>
  );
}
