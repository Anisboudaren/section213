"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";

import { Section213Logo } from "@/components/Section213Logo";
import { Button } from "@/components/ui/button";
import { HERO_FALLBACK_DESKTOP, HERO_FALLBACK_MOBILE } from "@/lib/hero-video-sources";
import { cn } from "@/lib/utils";

type SiteMessagePageProps = {
  variant: "maintenance" | "notFound";
};

const COPY = {
  maintenance: {
    fr: {
      title: "Site en maintenance",
      body: "Nous améliorons Section 213 pour vous offrir une meilleure expérience. Nous serons de retour très bientôt.",
      contact: "Nous contacter",
    },
    en: {
      title: "Site under maintenance",
      body: "We're improving Section 213 to serve you better. We'll be back online very soon.",
      contact: "Contact us",
    },
  },
  notFound: {
    fr: {
      title: "Page introuvable",
      body: "Cette page n'existe pas ou a été déplacée. Retournez à l'accueil ou contactez-nous.",
      home: "Retour à l'accueil",
      contact: "Nous contacter",
    },
    en: {
      title: "Page not found",
      body: "This page doesn't exist or has been moved. Head home or get in touch.",
      home: "Back to home",
      contact: "Contact us",
    },
  },
} as const;

function BilingualBlock({
  fr,
  en,
  code,
}: {
  fr: { title: string; body: string };
  en: { title: string; body: string };
  code?: string;
}) {
  return (
    <div className="space-y-6 text-center text-white">
      {code && (
        <p className="font-display text-7xl leading-none tracking-wide text-gold sm:text-8xl md:text-9xl">
          {code}
        </p>
      )}
      <div className="space-y-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl tracking-wide sm:text-3xl md:text-4xl">{fr.title}</h1>
          <p className="text-sm text-white/55 sm:text-base">{en.title}</p>
        </div>
        <div className="mx-auto max-w-lg space-y-2 text-sm leading-relaxed text-white/75 sm:text-base">
          <p>{fr.body}</p>
          <p className="text-white/55">{en.body}</p>
        </div>
      </div>
    </div>
  );
}

export function SiteMessagePage({ variant }: SiteMessagePageProps) {
  const isMaintenance = variant === "maintenance";
  const copy = COPY[variant];

  return (
    <div className="theme-marketing relative flex min-h-svh flex-col">
      <div className="absolute inset-0">
        <Image
          src={HERO_FALLBACK_MOBILE}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover md:hidden"
        />
        <Image
          src={HERO_FALLBACK_DESKTOP}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hidden object-cover md:block"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/70 via-transparent to-ruby/15" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">
        <div className="mb-8 sm:mb-10">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <Section213Logo priority size="lg" className="brightness-110" />
          </Link>
        </div>

        <div
          className={cn(
            "w-full max-w-2xl rounded-2xl border border-white/10 bg-black/35 p-6 backdrop-blur-md sm:p-8 md:p-10",
          )}
        >
          <BilingualBlock
            fr={copy.fr}
            en={copy.en}
            code={isMaintenance ? undefined : "404"}
          />

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            {!isMaintenance && (
              <Button asChild variant="gold" size="lg" className="min-h-11 w-full sm:w-auto">
                <Link href="/">{(copy as typeof COPY.notFound).fr.home}</Link>
              </Button>
            )}
            <Button
              asChild
              variant={isMaintenance ? "gold" : "outline"}
              size="lg"
              className={cn(
                "min-h-11 w-full sm:w-auto",
                !isMaintenance && "border-white/25 bg-white/5 text-white hover:bg-white/10 hover:text-white",
              )}
            >
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                {copy.fr.contact}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
