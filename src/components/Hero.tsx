import { useEffect, useRef, useState } from "react";
import { ChevronRight, MapPin, Pencil, User, Phone, Camera } from "lucide-react";

const BG_VIDEO =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4";

const REELS = [
  {
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    title: "Luxury Lakefront Estate",
    location: "Lake Norman, NC",
  },
  {
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    title: "Modern Downtown Loft",
    location: "Charlotte, NC",
  },
  {
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    title: "Mountain Retreat",
    location: "Asheville, NC",
  },
];

function Nav() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 py-5 text-white">
      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="#services" className="hover:text-gold transition-colors">Services</a>
        <a href="#portfolio" className="hover:text-gold transition-colors">Portfolio</a>
        <a href="#about" className="hover:text-gold transition-colors">About</a>
        <a href="#listing" className="hover:text-gold transition-colors">Listing media</a>
        <a href="#social" className="hover:text-gold transition-colors">Social media</a>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="text-gold font-display text-2xl tracking-wider">4</span>
        <div className="leading-none">
          <div className="font-display text-xl tracking-wider text-white">HORSEMEN</div>
          <div className="text-[10px] tracking-[0.3em] text-gold">MEDIA</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <a href="tel:7048324498" className="hidden sm:flex items-center gap-2 text-sm font-semibold">
          (704) 832-4498 <Phone className="w-4 h-4 text-gold" />
        </a>
        <button className="bg-gold text-gold-foreground px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition">
          <Camera className="w-4 h-4" /> Book a Shoot
        </button>
      </div>
    </nav>
  );
}

function HeroTop() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-ink">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={BG_VIDEO}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black" />
      <Nav />
      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-8">
        <div className="flex items-center gap-2 text-white/90 text-sm mb-4">
          <MapPin className="w-4 h-4 text-gold" />
          North Carolina Based Real Estate Media Company
        </div>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] tracking-tight max-w-4xl">
          <span className="text-gold">CINEMATIC CONTENT</span> THAT WINS LISTINGS AND GETS CLIENTS.
        </h1>
        <div className="mt-8 space-y-3 text-white/90 max-w-2xl">
          <div className="flex gap-3">
            <Pencil className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <p>Hooks + scripts included: we tell you exactly what to say.</p>
          </div>
          <div className="flex gap-3">
            <User className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <p>
              Made for agents: branding videos, short-form reels, photos, drone and more for
              the agents that want to stand out.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <button className="bg-gold text-gold-foreground px-6 py-3 rounded-md font-semibold flex items-center gap-2 hover:brightness-110 transition">
            Our Packages <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[280px] h-[580px] md:w-[320px] md:h-[660px]">
      {/* Frame */}
      <div className="absolute inset-0 rounded-[3rem] bg-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-[10px] ring-ink" />
      {/* Notch */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-ink rounded-full z-20" />
      {/* Screen */}
      <div className="absolute inset-[10px] rounded-[2.5rem] overflow-hidden bg-black">
        {children}
      </div>
    </div>
  );
}

function ReelsScroll() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0..(REELS.length-1) fractional

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = (scrolled / total) * (REELS.length - 1);
      setProgress(p);
      const idx = Math.round(p);
      setActiveIndex(idx);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === activeIndex) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-secondary"
      style={{ height: `${REELS.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <h2 className="font-display text-4xl md:text-6xl text-ink text-center mb-2">
          WE MAKE LISTINGS <span className="text-gold">GO VIRAL</span>
        </h2>
        <p className="text-muted-foreground mb-8">
          Scroll-stopping content that drives engagement.
        </p>

        <PhoneFrame>
          <div className="relative w-full h-full">
            {REELS.map((reel, i) => {
              const offset = (i - progress) * 100;
              return (
                <div
                  key={reel.src}
                  className="absolute inset-0 transition-transform duration-300 ease-out"
                  style={{ transform: `translateY(${offset}%)` }}
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={reel.src}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <div className="text-xs text-gold uppercase tracking-wider">
                      {reel.location}
                    </div>
                    <div className="font-semibold">{reel.title}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </PhoneFrame>

        {/* Progress dots */}
        <div className="mt-6 flex gap-2">
          {REELS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === activeIndex ? "w-8 bg-gold" : "w-1.5 bg-ink/20"
              }`}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground uppercase tracking-widest">
          Keep scrolling
        </p>
      </div>
    </section>
  );
}

export function Hero() {
  return (
    <>
      <HeroTop />
      <ReelsScroll />
    </>
  );
}
