import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Michelle Martinez",
    quote:
      "The team at 4 Horsemen completely changed how I show up online. My listings sell faster and my brand looks consistent everywhere.",
  },
  {
    name: "Jordan Lee",
    quote:
      "Hands down the best media team I've worked with. The cinematic walk-throughs put my listings on a different level.",
  },
  {
    name: "Sarah K.",
    quote:
      "Booking was simple, the shoot day was fun, and the delivery was lightning fast. I'm a customer for life.",
  },
  {
    name: "Carter Reilly",
    quote:
      "My Instagram presence finally matches the quality of my service. Reels that actually convert leads.",
  },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const visible = 4;
  return (
    <section className="bg-secondary py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-5xl text-center text-ink mb-12">
          WHAT CUSTOMERS SAY AFTER <span className="text-gold">THE SHOOT</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.slice(0, visible).map((t) => (
            <div key={t.name} className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm text-ink/80 leading-relaxed mb-5">"{t.quote}"</p>
              <div className="text-sm font-semibold text-ink">{t.name}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setIndex(Math.max(0, index - 1))}
            className="w-9 h-9 rounded-full border border-ink/20 flex items-center justify-center hover:bg-ink hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIndex(index + 1)}
            className="w-9 h-9 rounded-full bg-gold text-gold-foreground flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
