import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";

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
    </main>
  );
}
