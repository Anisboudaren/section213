"use client";

import Link from "next/link";
import { ViralBurstBackground } from "@/components/ViralBurstBackground";
import { SectionIndex } from "@/components/home-v2/SectionIndex";
import { useHeroMedia } from "@/hooks/use-hero-media";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { handleSmoothScroll } from "@/lib/smooth-scroll";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import {
  Bookmark,
  ChevronDown,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
  Music2,
  Pencil,
  Phone,
  Share2,
  User,
  Camera,
  Volume2,
  VolumeX,
} from "lucide-react";

const BG_VIDEO = "/vids/hero.mp4";

const REELS = [
  {
    src: "/vids/scroll-1.mp4",
    title: "Luxury listing walk-through",
    location: "Oran, Algeria",
    likes: "48.2K",
    comments: "1,204",
    shares: "3.8K",
    saves: "9.1K",
    sound: "Original Sound — Section 213",
  },
  {
    src: "/vids/scroll-2.mp4",
    title: "Agent brand reel — day in the life",
    location: "Algiers, Algeria",
    likes: "112K",
    comments: "2,891",
    shares: "8.4K",
    saves: "21K",
    sound: "Trending Audio — Section 213",
  },
  {
    src: "/vids/scroll-3.mp4",
    title: "Cinematic drone + interior combo",
    location: "Tlemcen, Algeria",
    likes: "76.5K",
    comments: "1,672",
    shares: "5.2K",
    saves: "14.3K",
    sound: "Viral Mix — Section 213",
  },
];

function Section213Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-ruby font-display text-2xl tracking-wider">213</span>
      <div className="leading-none">
        <div className="font-display text-xl tracking-wider">SECTION</div>
        <div className="text-[10px] tracking-[0.3em] text-ruby">213</div>
      </div>
    </div>
  );
}

function SoundToggle({
  soundOn,
  onToggle,
  className = "",
}: {
  soundOn: boolean;
  onToggle: () => void;
  className?: string;
}) {
  const { translations: t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={soundOn ? t.nav.muteVideos : t.nav.unmuteVideos}
      className={`flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black/70 ${className}`}
    >
      {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      {soundOn ? t.nav.soundOn : t.nav.tapForSound}
    </button>
  );
}

function Nav({ soundOn, onToggleSound }: { soundOn: boolean; onToggleSound: () => void }) {
  const { translations: t } = useLanguage();

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-5 text-white md:px-8">
      <div className="shrink-0 md:hidden">
        <Section213Logo />
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium">
        <a href="#services" onClick={(e) => handleSmoothScroll(e, "services")} className="hover:text-gold transition-colors">
          {t.nav.services}
        </a>
        <a href="#portfolio" onClick={(e) => handleSmoothScroll(e, "portfolio")} className="hover:text-gold transition-colors">
          {t.nav.portfolio}
        </a>
        <a href="#about" onClick={(e) => handleSmoothScroll(e, "about")} className="hover:text-gold transition-colors">
          {t.nav.about}
        </a>
        <a href="#listing" onClick={(e) => handleSmoothScroll(e, "listing")} className="hover:text-gold transition-colors">
          {t.nav.listingMedia}
        </a>
        <a href="#digital" onClick={(e) => handleSmoothScroll(e, "digital")} className="hover:text-gold transition-colors">
          {t.nav.automations}
        </a>
      </div>

      <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
        <Section213Logo />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <SoundToggle soundOn={soundOn} onToggle={onToggleSound} className="hidden sm:flex" />
        <a
          href="tel:7048324498"
          className="hidden lg:flex items-center gap-2 text-sm font-semibold"
        >
          (704) 832-4498 <Phone className="w-4 h-4 text-gold" />
        </a>
        <Link
          href="/book"
          className="bg-brand-accent px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 hover:brightness-110 transition"
        >
          <Camera className="w-4 h-4" /> {t.nav.bookAShoot}
        </Link>
      </div>
    </nav>
  );
}

function ScrollHint() {
  const { translations: t } = useLanguage();

  return (
    <a
      href="#portfolio"
      onClick={(e) => handleSmoothScroll(e, "portfolio")}
      className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-white/60 transition-colors hover:text-gold"
      aria-label={t.hero.scrollToReels}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">{t.hero.scroll}</span>
      <ChevronDown className="h-6 w-6 animate-bounce" />
    </a>
  );
}

function HeroTop({
  soundOn,
  onToggleSound,
  reelsInView,
  heroInView,
  videoRef,
  onHeroInViewChange,
}: {
  soundOn: boolean;
  onToggleSound: () => void;
  reelsInView: boolean;
  heroInView: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onHeroInViewChange: (inView: boolean) => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => onHeroInViewChange(entry.isIntersecting && entry.intersectionRatio > 0.35),
      { threshold: [0, 0.35, 0.6] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onHeroInViewChange]);

  const heroAudible = soundOn && heroInView && !reelsInView;
  const { translations: t } = useLanguage();

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-ink">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover grayscale"
        src={BG_VIDEO}
        autoPlay
        muted={!heroAudible}
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black" />
      <Nav soundOn={soundOn} onToggleSound={onToggleSound} />
      <div className="absolute bottom-8 right-8 z-20 sm:hidden">
        <SoundToggle soundOn={soundOn} onToggle={onToggleSound} />
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-8">
        <div className="flex items-center gap-2 text-white/90 text-sm mb-4">
          <MapPin className="w-4 h-4 text-gold" />
          {t.hero.location}
        </div>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] tracking-tight max-w-4xl">
          <span className="text-ruby">{t.hero.headlineGold}</span> {t.hero.headlineRest}
        </h1>
        <div className="mt-8 space-y-3 text-white/90 max-w-2xl">
          <div className="flex gap-3">
            <Pencil className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <p>{t.hero.bullet1}</p>
          </div>
          <div className="flex gap-3">
            <User className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <p>{t.hero.bullet2}</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="hidden lg:block lg:flex-1" />
          <div className="hero-stair-buttons ml-auto flex w-full max-w-sm flex-col items-end gap-3 sm:max-w-md">
            <a
              href="#services"
              onClick={(e) => handleSmoothScroll(e, "services")}
              className="hero-stair-step hero-stair-step-1 bg-brand-accent text-ruby-foreground px-6 py-3 rounded-md font-semibold flex items-center gap-2 hover:brightness-110 transition shadow-lg"
            >
              {t.hero.ourPackages} <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="#portfolio"
              onClick={(e) => handleSmoothScroll(e, "portfolio")}
              className="hero-stair-step hero-stair-step-2 rounded-md border border-white/30 bg-black/30 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/60 hover:text-white"
            >
              {t.hero.seeViralReels}
            </a>
            {!soundOn ? (
              <button
                type="button"
                onClick={onToggleSound}
                className="hero-stair-step hero-stair-step-3 flex items-center gap-2 rounded-md border border-white/30 bg-black/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/60 hover:text-white"
              >
                <Volume2 className="h-4 w-4" /> {t.hero.enableSound}
              </button>
            ) : (
              <button
                type="button"
                onClick={onToggleSound}
                className="hero-stair-step hero-stair-step-3 flex items-center gap-2 rounded-md border border-white/40 bg-black/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                <Volume2 className="h-4 w-4" /> {t.nav.soundOn}
              </button>
            )}
          </div>
        </div>
      </div>
      <ScrollHint />
    </section>
  );
}

function PhoneFrame({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[320/660] h-full w-auto",
        compact
          ? "max-h-[min(540px,calc(100svh-11rem))] max-w-[min(280px,78vw)]"
          : "max-h-[min(660px,calc(100svh-15rem))] max-w-[min(320px,85vw)]",
      )}
    >
      <div className="absolute inset-0 rounded-[3rem] bg-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-[10px] ring-ink" />
      <div className="absolute top-2 left-1/2 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-ink" />
      <div className="absolute inset-[10px] overflow-hidden rounded-[2.5rem] bg-black">
        {children}
      </div>
    </div>
  );
}

function TikTokOverlay({
  reel,
  isActive,
  soundOn,
  onToggleSound,
}: {
  reel: (typeof REELS)[0];
  isActive: boolean;
  soundOn: boolean;
  onToggleSound: () => void;
}) {
  return (
    <>
      <div className="absolute top-3 inset-x-3 z-10 flex items-center justify-between text-white text-[10px] font-semibold">
        <span className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full">Following</span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onToggleSound();
          }}
          className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full"
        >
          {soundOn ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
          {soundOn ? "On" : "Sound"}
        </button>
      </div>

      <div className="absolute right-2 bottom-28 z-10 flex flex-col items-center gap-4">
        <div className="relative mb-1">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-white to-ink/80 border-2 border-white flex items-center justify-center">
            <span className="font-display text-xs text-ink">213</span>
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold leading-none">
            +
          </div>
        </div>

        <ActionButton icon={Heart} count={reel.likes} filled pulse={isActive} />
        <ActionButton icon={MessageCircle} count={reel.comments} />
        <ActionButton icon={Share2} count={reel.shares} />
        <ActionButton icon={Bookmark} count={reel.saves} />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 p-4 pt-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm">@section213</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Follow</span>
        </div>
        <p className="text-sm leading-snug mb-2 pr-14">{reel.title}</p>
        <div className="flex items-center gap-2 text-xs text-white/80">
          <Music2 className="w-3.5 h-3.5 shrink-0 animate-pulse" />
          <span className="truncate">{reel.sound}</span>
        </div>
        <div className="mt-2 text-[10px] text-gold uppercase tracking-wider">{reel.location}</div>
      </div>
    </>
  );
}

function ActionButton({
  icon: Icon,
  count,
  filled = false,
  pulse = false,
}: {
  icon: typeof Heart;
  count: string;
  filled?: boolean;
  pulse?: boolean;
}) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center gap-0.5 text-white transition-transform ${pulse ? "animate-[bounce_0.6s_ease-in-out_1]" : ""}`}
    >
      <Icon
        className={`w-7 h-7 drop-shadow-md ${filled ? "fill-red-500 text-red-500" : ""}`}
      />
      <span className="text-[10px] font-semibold drop-shadow-md">{count}</span>
    </button>
  );
}

const REEL_SNAP_MS = 420;
const WHEEL_THRESHOLD = 28;
const SWIPE_THRESHOLD = 48;

export function ReelsScroll({
  soundOn,
  onToggleSound,
  onInViewChange,
  onActiveIndexChange,
  reelVideoRefs,
  sectionLabel,
  compactPhone = false,
}: {
  soundOn: boolean;
  onToggleSound: () => void;
  onInViewChange: (inView: boolean) => void;
  onActiveIndexChange: (index: number) => void;
  reelVideoRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>;
  sectionLabel?: string;
  compactPhone?: boolean;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const isSnappingRef = useRef(false);
  const touchStartY = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);

  const snapScrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const el = sectionRef.current;
    if (!el) return;
    const top = el.offsetTop + index * window.innerHeight;
    window.scrollTo({ top, behavior });
  }, []);

  const goToIndex = useCallback(
    (next: number, behavior: ScrollBehavior = "smooth") => {
      const clamped = Math.max(0, Math.min(REELS.length - 1, next));
      if (clamped === activeIndexRef.current || isSnappingRef.current) return;

      isSnappingRef.current = true;
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);
      onActiveIndexChange(clamped);
      snapScrollToIndex(clamped, behavior);

      window.setTimeout(() => {
        isSnappingRef.current = false;
      }, REEL_SNAP_MS);
    },
    [onActiveIndexChange, snapScrollToIndex],
  );

  const getIndexFromScroll = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return 0;
    const scrolledInto = window.scrollY - el.offsetTop;
    const index = Math.round(scrolledInto / window.innerHeight);
    return Math.max(0, Math.min(REELS.length - 1, index));
  }, []);

  const isSectionPinned = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top <= 2 && rect.bottom >= window.innerHeight - 2;
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => onInViewChange(entry.isIntersecting && entry.intersectionRatio > 0.3),
      { threshold: [0, 0.3, 0.6] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onInViewChange]);

  useEffect(() => {
    let snapTimeout: number;

    const onScroll = () => {
      if (isSnappingRef.current) return;

      const nextIndex = getIndexFromScroll();
      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
        onActiveIndexChange(nextIndex);
      }

      window.clearTimeout(snapTimeout);
      snapTimeout = window.setTimeout(() => {
        if (isSnappingRef.current || !isSectionPinned()) return;
        const snapped = getIndexFromScroll();
        const el = sectionRef.current;
        if (!el) return;
        const target = el.offsetTop + snapped * window.innerHeight;
        if (Math.abs(window.scrollY - target) > 4) {
          window.scrollTo({ top: target, behavior: "smooth" });
        }
      }, 90);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(snapTimeout);
      window.removeEventListener("scroll", onScroll);
    };
  }, [getIndexFromScroll, isSectionPinned]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (!isSectionPinned() || isSnappingRef.current) return;

      const delta = event.deltaY;
      if (Math.abs(delta) < WHEEL_THRESHOLD) return;

      const current = activeIndexRef.current;

      if (delta > 0 && current < REELS.length - 1) {
        event.preventDefault();
        goToIndex(current + 1);
      } else if (delta < 0 && current > 0) {
        event.preventDefault();
        goToIndex(current - 1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goToIndex, isSectionPinned]);

  useEffect(() => {
    reelVideoRefs.current.forEach((video, i) => {
      if (!video) return;
      const isActive = i === activeIndex;
      if (isActive) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex, reelVideoRefs]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (isSnappingRef.current) return;

    const delta = touchStartY.current - event.changedTouches[0].clientY;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;

    const current = activeIndexRef.current;
    if (delta > 0 && current < REELS.length - 1) {
      goToIndex(current + 1);
    } else if (delta < 0 && current > 0) {
      goToIndex(current - 1);
    }
  };

  const { translations: t } = useLanguage();
  const activeTheme = t.reels.themes[activeIndex] ?? t.reels.themes[0];

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative bg-mist bg-dot-grid"
      style={{ height: `${REELS.length * 100}vh` }}
    >
      <div className="sticky top-0 h-svh w-full overflow-hidden">
        <ViralBurstBackground themeIndex={activeIndex} />

        <div className="relative z-10 flex h-full min-h-0 flex-col items-center px-4 pb-4 pt-4 sm:pt-6 md:pt-8">
          <header className="w-full max-w-xl shrink-0 text-center">
            {sectionLabel ? (
              <SectionIndex index={sectionLabel} className="mb-2 text-center sm:mb-3" />
            ) : null}
            <h2
              className={cn(
                "mb-1 font-display leading-tight text-ink",
                compactPhone
                  ? "text-[clamp(1.35rem,4vw+0.5rem,2.5rem)]"
                  : "text-[clamp(1.65rem,3.2vw+0.75rem,3.75rem)]",
              )}
            >
              {t.reels.title} <span className="text-ruby">{t.reels.titleHighlight}</span>
            </h2>
            <p
              key={activeIndex}
              className="viral-burst-set mx-auto max-w-md px-2 text-sm text-muted-foreground sm:text-base"
            >
              {activeTheme.subtitle}
            </p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/60">
              {activeTheme.label}
            </p>
          </header>

          <div className="flex min-h-0 w-full flex-1 items-center justify-center py-2 sm:py-3">
            <PhoneFrame compact={compactPhone}>
              <div
                className="relative h-full w-full cursor-grab touch-pan-y overflow-hidden active:cursor-grabbing"
                onClick={() => {
                  if (!soundOn) onToggleSound();
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="reel-track absolute left-0 top-0 w-full"
                  style={{
                    height: `${REELS.length * 100}%`,
                    transform: `translateY(-${(activeIndex / REELS.length) * 100}%)`,
                  }}
                >
                  {REELS.map((reel, i) => {
                    const isActive = i === activeIndex;
                    return (
                      <div
                        key={reel.src}
                        className="relative w-full"
                        style={{ height: `${100 / REELS.length}%` }}
                      >
                        <video
                          ref={(el) => {
                            reelVideoRefs.current[i] = el;
                          }}
                          src={reel.src}
                          autoPlay={i === 0}
                          muted={!soundOn || i !== activeIndex}
                          loop
                          playsInline
                          preload="auto"
                          className="h-full w-full object-cover"
                        />
                        <TikTokOverlay
                          reel={reel}
                          isActive={isActive}
                          soundOn={soundOn}
                          onToggleSound={onToggleSound}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </PhoneFrame>
          </div>

          <footer className="w-full shrink-0 pt-1 text-center sm:pt-2">
            <div className="flex justify-center gap-2">
              {REELS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to reel ${i + 1}`}
                  onClick={() => goToIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === activeIndex ? "w-8 bg-brand-accent" : "w-1.5 bg-ink/20 hover:bg-ink/40",
                  )}
                />
              ))}
            </div>
            <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground sm:mt-3 sm:text-xs">
              {soundOn ? "Swipe up/down or scroll to snap" : "Tap the phone or enable sound above"}
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
}

export function Hero() {
  const {
    soundOn,
    reelsInView,
    heroInView,
    toggleSound,
    heroVideoRef,
    reelVideoRefs,
    handleHeroInView,
    handleReelsInView,
    handleActiveReelChange,
  } = useHeroMedia();

  return (
    <>
      <HeroTop
        soundOn={soundOn}
        onToggleSound={toggleSound}
        reelsInView={reelsInView}
        heroInView={heroInView}
        videoRef={heroVideoRef}
        onHeroInViewChange={handleHeroInView}
      />
      <ReelsScroll
        soundOn={soundOn}
        onToggleSound={toggleSound}
        onInViewChange={handleReelsInView}
        onActiveIndexChange={handleActiveReelChange}
        reelVideoRefs={reelVideoRefs}
      />
    </>
  );
}

export { Section213Logo };
