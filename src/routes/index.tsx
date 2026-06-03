import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/sections/Process";
import { Pricing } from "@/components/sections/Pricing";
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
      { title: "4 Horsemen Media — Cinematic Real Estate Content" },
      {
        name: "description",
        content:
          "North Carolina based real estate media company. Cinematic content that wins listings and gets clients.",
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
