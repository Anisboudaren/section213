import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const CATEGORIES = [
  "General Questions", "Booking & Scheduling", "Pricing & Packages",
  "Content & Delivery", "Shoot Day Essentials", "Turnaround & Revisions",
  "Travel & Locations",
];

const FAQS: Record<string, { q: string; a: string }[]> = {
  "General Questions": [
    { q: "What does 4 Horsemen Media specialize in?", a: "We're a real estate media company producing cinematic videos, photos, drone, and short-form social content for top-producing agents." },
    { q: "Who do you work with?", a: "Realtors, brokerages, and real estate teams across the US who care about how their brand shows up." },
    { q: "What areas do you serve?", a: "Headquartered in North Carolina, but we travel nationwide for multi-day shoots." },
  ],
};

export function FAQ() {
  const [active, setActive] = useState("General Questions");
  const [open, setOpen] = useState<number | null>(0);
  const list = FAQS[active] ?? FAQS["General Questions"];
  return (
    <section className="bg-secondary py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-5xl text-center text-ink mb-10">
          FREQUENTLY ASKED <span className="text-gold">QUESTIONS</span>
        </h2>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`text-xs px-3 py-1.5 rounded-full border transition ${
                active === c
                  ? "bg-ink text-white border-ink"
                  : "border-ink/20 text-ink/70 hover:border-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {list.map((item, i) => (
            <div key={item.q} className="bg-white rounded-xl border border-ink/10">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-medium text-ink text-sm">{item.q}</span>
                {open === i ? <Minus className="w-4 h-4 text-gold" /> : <Plus className="w-4 h-4 text-gold" />}
              </button>
              {open === i && (
                <div className="px-4 pb-4 text-sm text-ink/70">{item.a}</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 bg-ink text-white rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            <div className="font-semibold text-sm">Still have questions?</div>
            <div className="text-xs text-white/60">Our team will get back to you within 24 hours.</div>
          </div>
          <button className="bg-gold text-gold-foreground px-4 py-2 rounded-md text-sm font-semibold">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}
