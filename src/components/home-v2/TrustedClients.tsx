"use client";

import Image from "next/image";
import Link from "next/link";

import type { TrustedPartnerDto, TrustedSectionCopyDto } from "@/lib/actions/trusted-partners";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

import { RevealInView } from "./RevealInView";
import { SectionIndex } from "./SectionIndex";

type TrustedClientsProps = {
  partners: TrustedPartnerDto[];
  copy: TrustedSectionCopyDto;
};

function PartnerMarqueeItem({ client }: { client: TrustedPartnerDto }) {
  const inner = (
    <div className="flex h-[7rem] w-[13rem] shrink-0 flex-col items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 transition hover:border-white/25 hover:bg-white/[0.06] sm:h-[8rem] sm:w-[15rem] sm:gap-3">
      <div className="relative flex h-14 w-full items-center justify-center sm:h-16">
        <Image
          src={client.imageUrl}
          alt={client.name}
          width={180}
          height={64}
          unoptimized={
            client.imageUrl.startsWith("http") ||
            client.imageUrl.includes("blob.vercel-storage.com")
          }
          className={cn(
            "max-h-14 w-auto object-contain sm:max-h-16",
            client.whiteFilter && "brightness-0 invert",
          )}
        />
      </div>
      <p className="truncate text-center font-display text-xs tracking-wider text-white/85 sm:text-sm">
        {client.name.toUpperCase()}
      </p>
    </div>
  );

  if (client.linkUrl) {
    return (
      <Link
        href={client.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ruby"
      >
        {inner}
      </Link>
    );
  }

  return <div className="shrink-0">{inner}</div>;
}

function TrustedMarqueeStripe({
  partners,
  direction,
}: {
  partners: TrustedPartnerDto[];
  direction: "left" | "right";
}) {
  const loop = [...partners, ...partners];

  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          "flex w-max gap-4 sm:gap-5",
          direction === "left" ? "trusted-marquee-left" : "trusted-marquee-right",
        )}
      >
        {loop.map((client, i) => (
          <PartnerMarqueeItem key={`${client.id}-${i}`} client={client} />
        ))}
      </div>
    </div>
  );
}

export function TrustedClients({ partners, copy }: TrustedClientsProps) {
  const { locale } = useLanguage();
  const c = locale === "fr" ? copy.fr : copy.en;

  const midpoint = Math.ceil(partners.length / 2);
  const topRow = partners.slice(0, midpoint);
  const bottomRow = partners.slice(midpoint);

  return (
    <section className="bg-ink px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <RevealInView>
          <SectionIndex index={copy.index} />
          <h2 className="font-display text-3xl leading-tight sm:text-5xl">
            {c.title} <span className="text-ruby">{c.titleHighlight}</span>
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/60 sm:text-base">{c.subtitle}</p>
        </RevealInView>

        {partners.length > 0 ? (
          <RevealInView className="mt-10 sm:mt-12">
            <div className="relative -mx-4 sm:-mx-6">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-ink via-ink/80 to-transparent sm:h-14"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-ink via-ink/80 to-transparent sm:h-14"
              />

              <div className="space-y-4 py-4 sm:space-y-5 sm:py-5">
                {topRow.length > 0 ? (
                  <TrustedMarqueeStripe partners={topRow} direction="left" />
                ) : null}
                {bottomRow.length > 0 ? (
                  <TrustedMarqueeStripe partners={bottomRow} direction="right" />
                ) : null}
              </div>
            </div>
          </RevealInView>
        ) : null}
      </div>
    </section>
  );
}
