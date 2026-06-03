import { Calendar, Package, Camera, Send } from "lucide-react";

const STEPS = [
  { icon: Calendar, title: "Book your shoot", desc: "Book online and let us know what you need." },
  { icon: Package, title: "Select package", desc: "Choose the package that fits your listing." },
  { icon: Camera, title: "Shoot day", desc: "Our team shows up and captures it all." },
  { icon: Send, title: "Media delivery", desc: "Receive your media within 24-48 hours." },
];

export function Process() {
  return (
    <section className="bg-ink text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-4xl md:text-6xl text-center mb-2">
          IT'S AS EASY AS <span className="text-gold">ONE, TWO, THREE.</span>
        </h2>
        <div className="text-center mb-12">
          <button className="mt-6 bg-gold text-gold-foreground px-5 py-2 rounded-md text-sm font-semibold">
            Get Started
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-gold/50 transition"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-gold" />
                </div>
                <span className="font-display text-3xl text-white/20">0{i + 1}</span>
              </div>
              <h3 className="font-display text-xl tracking-wider mb-2">{s.title.toUpperCase()}</h3>
              <p className="text-sm text-white/60">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
