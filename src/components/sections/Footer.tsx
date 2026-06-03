import { Instagram, Facebook, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-white py-12 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gold font-display text-2xl tracking-wider">4</span>
            <div className="leading-none">
              <div className="font-display text-xl tracking-wider">HORSEMEN</div>
              <div className="text-[10px] tracking-[0.3em] text-gold">MEDIA</div>
            </div>
          </div>
          <p className="text-xs text-white/50">Cinematic real estate media. Based in NC.</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-gold mb-3">Services</div>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Listing Media</li>
            <li>Social Reels</li>
            <li>Branding Videos</li>
            <li>Drone</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-gold mb-3">Company</div>
          <ul className="space-y-2 text-sm text-white/70">
            <li>About</li>
            <li>Portfolio</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-gold mb-3">Follow</div>
          <div className="flex gap-3">
            <Instagram className="w-5 h-5 text-white/70 hover:text-gold transition" />
            <Facebook className="w-5 h-5 text-white/70 hover:text-gold transition" />
            <Youtube className="w-5 h-5 text-white/70 hover:text-gold transition" />
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 text-xs text-white/40 flex flex-col md:flex-row justify-between gap-2">
        <div>© 2026 4 Horsemen Media. All rights reserved.</div>
        <div>(704) 832-4498 · hello@4horsemenmedia.com</div>
      </div>
    </footer>
  );
}
