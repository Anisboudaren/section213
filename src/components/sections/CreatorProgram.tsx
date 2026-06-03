import { Check, ChevronRight } from "lucide-react";

const TIERS = [
  {
    name: "Tier 1",
    price: "$1,800",
    features: ["4 Branding Videos / month", "Hooks + Scripts included", "Monthly Strategy Call"],
  },
  {
    name: "Tier 2",
    price: "$1,900",
    highlight: true,
    features: [
      "6 Branding Videos / month",
      "Hooks + Scripts included",
      "Bi-weekly Strategy Calls",
      "Priority Editing",
    ],
  },
  {
    name: "Tier 3",
    price: "$2,100",
    features: [
      "8 Branding Videos / month",
      "Custom Content Strategy",
      "Weekly Calls",
      "Full Editing Suite",
    ],
  },
];

export function CreatorProgram() {
  return (
    <section className="bg-ink text-white py-24 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-display text-4xl md:text-6xl text-center mb-2">
          CONTENT CREATOR <span className="text-gold">PROGRAM</span>
        </h2>
        <p className="text-center text-white/60 mb-12 max-w-xl mx-auto">
          Monthly recurring content built around you. Show up consistently and build
          the brand your business deserves.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`rounded-xl p-6 border transition ${
                t.highlight
                  ? "bg-gold/10 border-gold scale-[1.02]"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <h3 className="font-display text-2xl tracking-wider mb-3">{t.name}</h3>
              <div className="text-4xl font-bold mb-6">
                {t.price}
                <span className="text-base text-white/60">/mo</span>
              </div>
              <ul className="space-y-2 mb-6 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-white/80">
                    <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-1 transition ${
                  t.highlight
                    ? "bg-gold text-gold-foreground"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                Explore Tier <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
