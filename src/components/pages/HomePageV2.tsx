"use client";

import { BookCTA } from "@/components/home-v2/BookCTA";
import { HeroMobile } from "@/components/home-v2/HeroMobile";
import { Method213 } from "@/components/home-v2/Method213";
import { Offers } from "@/components/home-v2/Offers";
import { Problem } from "@/components/home-v2/Problem";
import { TrustedClients } from "@/components/home-v2/TrustedClients";
import { WhySection213 } from "@/components/home-v2/WhySection213";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";
import { Testimonials } from "@/components/sections/Testimonials";
import { useHeroMedia } from "@/hooks/use-hero-media";
import type { OfferAlaCarteView, OfferPackView } from "@/lib/offers/offer-types";
import type { TrustedSectionData } from "@/lib/queries/trusted-section";

type HomePageV2Props = {
  trustedSection: TrustedSectionData;
  packs: OfferPackView[];
  alaCarte: OfferAlaCarteView[];
};

export function HomePageV2({ trustedSection, packs, alaCarte }: HomePageV2Props) {
  const {
    soundOn,
    reelsInView,
    heroInView,
    toggleSound,
    heroVideoRef,
    handleHeroInView,
  } = useHeroMedia();

  return (
    <main className="theme-marketing min-h-screen bg-ink">
      <HeroMobile
        soundOn={soundOn}
        onToggleSound={toggleSound}
        reelsInView={reelsInView}
        heroInView={heroInView}
        videoRef={heroVideoRef}
        onHeroInViewChange={handleHeroInView}
        scrollTargetId="problem"
      />

      {/* 001 — Problem (dark) */}
      <Problem />

      {/* 002 — Method (dark) */}
      <Method213 />

      {/* 003 — Proof / logos (dark) */}
      <TrustedClients
        partners={trustedSection.partners}
        copy={trustedSection.copy}
      />

      {/* 004 — Why us (light) */}
      <WhySection213 />

      {/* 005 — Offers (dark) */}
      <Offers packs={packs} alaCarte={alaCarte} />

      {/* Light breathing room before checkout */}
      <Testimonials />
      <FAQ />

      {/* 006 — Checkout entry (dark) */}
      <BookCTA />
      <Footer />
    </main>
  );
}
