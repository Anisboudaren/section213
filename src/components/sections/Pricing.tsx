import { Check, ChevronRight } from "lucide-react";

const PACKAGES = [
  {
    name: "Starter",
    price: "$750",
    features: ["Professional HDR Photography", "Up to 25 Edited Images", "Standard Turnaround"],
  },
  {
    name: "Signatures",
    price: "$1,100",
    badge: "Popular",
    features: [
      "Everything in Starter",
      "Cinematic Walkthrough Video",
      "Twilight Photos optional",
      "Floor Plans",
      "Aerial Drone Photos",
    ],
  },
  {
    name: "Full Stable",
    price: "$1,425",
    highlight: true,
    badge: "Best Value",
    features: [
      "Everything in Signatures",
      "Cinematic Brand Video",
      "Social Reels (3x)",
      "Drone Video + Photos",
      "Twilight + Floor Plans",
      "Same-Day Highlights",
    ],
  },
  {
    name: "Custom",
    price: "CUSTOM",
    features: [
      "Tailored to your needs",
      "Multi-day shoots",
      "Brand campaigns",
      "Long-form video",
      "Add-ons as needed",
    ],
  },
];

export function Pricing() {
  return (
    <section id="services" className="bg-ink text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-6xl text-center mb-2">
          WHAT WE <span className="text-gold">OFFER</span>
        </h2>
        <p className="text-center text-white/60 mb-12 max-w-xl mx-auto">
          Real estate professionals trust the 4 Horsemen to make them and their listings
          look great on camera and online.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PACKAGES.map((p) => (
            <div
              key={p.name}
              className={`rounded-xl p-6 border transition relative ${
                p.highlight
                  ? "bg-gold/10 border-gold scale-[1.02]"
                  : "bg-white/5 border-white/10 hover:border-gold/40"
              }`}
            >
              {p.badge && (
                <span className="absolute -top-3 right-4 bg-gold text-gold-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  {p.badge}
                </span>
              )}
              <h3 className="font-display text-2xl tracking-wider mb-3">{p.name}</h3>
              <div className="text-3xl font-bold mb-6">{p.price}</div>
              <ul className="space-y-2 mb-6 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-white/80">
                    <Check className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2.5 rounded-md text-sm font-semibold flex items-center justify-center gap-1 transition ${
                  p.highlight
                    ? "bg-gold text-gold-foreground hover:brightness-110"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                Explore Package <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
