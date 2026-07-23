"use client";

import { Hero } from "@/components/Hero";
import { Process } from "@/components/sections/Process";
import { Pricing } from "@/components/sections/Pricing";
import { DigitalServices } from "@/components/sections/DigitalServices";
import { CreatorProgram } from "@/components/sections/CreatorProgram";
import { Travel } from "@/components/sections/Travel";
import { Trusted } from "@/components/sections/Trusted";
import { Stats } from "@/components/sections/Stats";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { InstagramCTA } from "@/components/sections/InstagramCTA";
import { Footer } from "@/components/sections/Footer";
import type { TestimonialDto } from "@/lib/actions/testimonials";

type HomePageProps = {
  testimonials?: TestimonialDto[];
};

export function HomePage({ testimonials = [] }: HomePageProps) {
  return (
    <main className="theme-marketing min-h-screen bg-background">
      <Hero />
      <Process />
      <Pricing />
      <DigitalServices />
      <CreatorProgram />
      <Travel />
      <Trusted />
      <Stats />
      <div className="bg-mist-ruby-texture">
        <Testimonials items={testimonials} />
        <FAQ />
      </div>
      <InstagramCTA />
      <Footer />
    </main>
  );
}
