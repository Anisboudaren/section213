import { createFileRoute } from "@tanstack/react-router";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Section 213 — Cinematic Content That Goes Viral" },
      {
        name: "description",
        content:
          "Section 213 — based in Oran, Algeria. Photography, marketing, websites, apps, and business automations for modern brands.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Process />
      <Pricing />
      <DigitalServices />
      <CreatorProgram />
      <Travel />
      <Trusted />
      <Stats />
      <Testimonials />
      <FAQ />
      <InstagramCTA />
      <Footer />
    </main>
  );
}
