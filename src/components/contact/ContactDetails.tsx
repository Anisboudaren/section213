"use client";

import Link from "next/link";
import {
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/icons/social-icons";
import { Button } from "@/components/ui/button";
import {
  buildSocialLinks,
  hasContactDetails,
  mailtoHref,
  telHref,
  whatsappHref,
  type PublicContactInfo,
} from "@/lib/contact-info";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

type ContactDetailsProps = {
  info: PublicContactInfo;
};

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
        <Icon className="h-4 w-4 text-ruby" />
      </span>
      <div className="min-w-0 pt-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">{label}</p>
        <div className="mt-1 text-sm text-white/85">{children}</div>
      </div>
    </div>
  );
}

function SocialIcon({ kind, className }: { kind: string; className?: string }) {
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

export function ContactDetails({ info }: ContactDetailsProps) {
  const { translations: t, locale } = useLanguage();
  const c = t.contact;
  const hours =
    locale === "fr"
      ? info.contactHoursFr
      : locale === "ar"
        ? (info.contactHoursEn ?? c.hoursDefault)
        : info.contactHoursEn;
  const socials = buildSocialLinks(info);
  const hasDetails = hasContactDetails(info);

  const addressLine = [info.contactAddress, info.contactCity].filter(Boolean).join(", ");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl tracking-wide sm:text-3xl">{c.detailsTitle}</h2>
        {!hasDetails && (
          <p className="mt-2 text-sm text-white/55">{c.emptyDetails}</p>
        )}
      </div>

      <div className="space-y-5">
        {addressLine && (
          <DetailRow icon={MapPin} label={c.address}>
            <p>{addressLine}</p>
            {info.mapsUrl && (
              <a
                href={info.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs text-ruby hover:underline"
              >
                {c.viewMap}
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </DetailRow>
        )}

        {hours && (
          <DetailRow icon={Clock} label={c.hours}>
            <p>{hours}</p>
          </DetailRow>
        )}

        {info.contactPhone && (
          <DetailRow icon={Phone} label={c.phone}>
            <a href={telHref(info.contactPhone)} className="hover:text-ruby transition-colors">
              {info.contactPhone}
            </a>
          </DetailRow>
        )}

        {info.contactEmail && (
          <DetailRow icon={Mail} label={c.email}>
            <a href={mailtoHref(info.contactEmail)} className="hover:text-ruby transition-colors">
              {info.contactEmail}
            </a>
          </DetailRow>
        )}
      </div>

      {socials.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">{c.socials}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {socials.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-medium text-white/80 transition hover:border-ruby/40 hover:text-white",
                )}
              >
                <SocialIcon kind={link.kind} className="h-4 w-4" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {info.whatsappNumber && (
          <Button asChild variant="outline" className="min-h-11 border-white/20 bg-transparent text-white hover:bg-white/10">
            <a href={whatsappHref(info.whatsappNumber)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="me-2 h-4 w-4" />
              {c.whatsappCta}
            </a>
          </Button>
        )}
        <Button asChild variant="ruby" className="min-h-11">
          <Link href="/book">{c.bookCta}</Link>
        </Button>
      </div>
    </div>
  );
}
