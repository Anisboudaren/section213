"use client";

import { ReelsScroll } from "@/components/Hero";
import { HeroMobile } from "@/components/home-v2/HeroMobile";
import { CaseStudies } from "@/components/home-v2/CaseStudies";
import { Method213 } from "@/components/home-v2/Method213";
import { Solutions } from "@/components/home-v2/Solutions";
import { TrustedClients } from "@/components/home-v2/TrustedClients";
import { WhySection213 } from "@/components/home-v2/WhySection213";
import { CreatorProgram } from "@/components/sections/CreatorProgram";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";
import { InstagramCTA } from "@/components/sections/InstagramCTA";
import { Pricing } from "@/components/sections/Pricing";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { Travel } from "@/components/sections/Travel";
import { useHeroMedia } from "@/hooks/use-hero-media";

export function HomePageV2() {
  const {
    soundOn,
    reelsInView,
    heroInView,
    toggleSound,
    heroVideoRef,
    reelVideoRefs,
    handleHeroInView,
    handleReelsInView,
    handleActiveReelChange,
  } = useHeroMedia();

  return (
    <main className="theme-marketing min-h-screen bg-background">
      <HeroMobile
        soundOn={soundOn}
        onToggleSound={toggleSound}
        reelsInView={reelsInView}
        heroInView={heroInView}
        videoRef={heroVideoRef}
        onHeroInViewChange={handleHeroInView}
        scrollTargetId="portfolio"
      />

      <ReelsScroll
        soundOn={soundOn}
        onToggleSound={toggleSound}
        onInViewChange={handleReelsInView}
        onActiveIndexChange={handleActiveReelChange}
        reelVideoRefs={reelVideoRefs}
        sectionLabel="001"
        compactPhone
      />

      <Method213 />
      <TrustedClients />
      <Solutions />
      <CaseStudies />
      <WhySection213 />

      <Pricing />
      <CreatorProgram />
      <Travel />
      <Stats />
      <Testimonials />
      <FAQ />
      <InstagramCTA />
      <Footer />
    </main>
  );
}
