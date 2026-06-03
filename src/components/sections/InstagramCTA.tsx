import { Instagram, ChevronRight } from "lucide-react";

export function InstagramCTA() {
  return (
    <section className="bg-secondary px-6 pb-20">
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-ink to-ink/90 rounded-2xl p-8 md:p-12 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        <div className="relative">
          <Instagram className="w-8 h-8 text-gold mb-4" />
          <h2 className="font-display text-3xl md:text-5xl text-white mb-3">
            BECOME THE AGENT ON <span className="text-gold">INSTAGRAM</span>
          </h2>
          <p className="text-white/70 max-w-xl mb-6">
            In 6 to 12 months 4 Horsemen Media's agents are dominating their local markets
            with cinematic content that converts.
          </p>
          <button className="bg-gold text-gold-foreground px-5 py-2.5 rounded-md font-semibold flex items-center gap-1">
            Book a Call <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
