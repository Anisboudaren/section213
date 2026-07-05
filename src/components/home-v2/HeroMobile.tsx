"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, Fragment } from "react";
import {
  Camera,
  ChevronDown,
  ChevronRight,
  MapPin,
  Phone,
  Volume2,
  VolumeX,
} from "lucide-react";

import { Section213Logo } from "@/components/Section213Logo";
import { useIsMobileViewport } from "@/hooks/use-is-mobile-viewport";
import {
  HERO_FALLBACK_DESKTOP,
  HERO_FALLBACK_MOBILE,
  HERO_VIDEO_DESKTOP,
  HERO_VIDEO_MOBILE,
} from "@/lib/hero-video-sources";
import { safePlay } from "@/lib/safe-video-play";
import { handleSmoothScroll } from "@/lib/smooth-scroll";
import { useContactInfo } from "@/lib/contact-info-context";
import { telHref } from "@/lib/contact-info";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

const heroVideoClassName =
  "absolute inset-0 h-full w-full object-cover grayscale";

type HeroMobileProps = {
  soundOn: boolean;
  onToggleSound: () => void;
  reelsInView: boolean;
  heroInView: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onHeroInViewChange: (inView: boolean) => void;
  scrollTargetId?: string;
};

function SoundToggle({
  soundOn,
  onToggle,
  className,
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
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-black/70",
        className,
      )}
    >
      {soundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      <span className="hidden sm:inline">{soundOn ? t.nav.soundOn : t.nav.tapForSound}</span>
    </button>
  );
}

export function HeroMobile({
  soundOn,
  onToggleSound,
  reelsInView,
  heroInView,
  videoRef,
  onHeroInViewChange,
  scrollTargetId = "problem",
}: HeroMobileProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const isMobile = useIsMobileViewport();
  const { translations: t } = useLanguage();
  const { contactPhone } = useContactInfo();
  const heroAudible = soundOn && heroInView && !reelsInView;

  const heroPoster =
    isMobile === false ? HERO_FALLBACK_DESKTOP : HERO_FALLBACK_MOBILE;
  const heroSrc =
    isMobile === null
      ? undefined
      : isMobile
        ? HERO_VIDEO_MOBILE
        : HERO_VIDEO_DESKTOP;

  useEffect(() => {
    if (videoRef) {
      videoRef.current = heroVideoRef.current;
    }
  }, [videoRef, heroSrc]);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video || !heroSrc) return;

    video.muted = !heroAudible;
    if (heroInView) {
      safePlay(video);
    } else {
      video.pause();
    }
  }, [heroAudible, heroInView, heroSrc]);

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

  return (
    <section
      ref={sectionRef}
      className="relative h-svh min-h-[580px] w-full overflow-hidden bg-ink text-white"
    >
      <Image
        src={HERO_FALLBACK_MOBILE}
        alt=""
        fill
        priority
        sizes="100vw"
        unoptimized
        className="object-cover grayscale md:hidden"
      />
      <Image
        src={HERO_FALLBACK_DESKTOP}
        alt=""
        fill
        priority
        sizes="100vw"
        unoptimized
        className="hidden object-cover grayscale md:block"
      />
      {heroSrc ? (
        <video
          key={heroSrc}
          ref={heroVideoRef}
          className={cn(heroVideoClassName, videoFailed && "hidden")}
          src={heroSrc}
          poster={heroPoster}
          muted={!heroAudible}
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoFailed(true)}
          onCanPlay={(event) => {
            if (heroInView) safePlay(event.currentTarget);
          }}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/25 to-black/85" />

      <nav className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-4 sm:px-6 md:px-8 md:py-5">
        <div className="md:hidden">
          <Section213Logo priority size="sm" />
        </div>

        <div className="hidden md:flex md:flex-1 md:items-center md:gap-6 lg:gap-8 text-sm font-medium">
          <a href="#offers" onClick={(e) => handleSmoothScroll(e, "offers")} className="hover:text-ruby transition-colors">
            {t.nav.services}
          </a>
          <a href="#problem" onClick={(e) => handleSmoothScroll(e, "problem")} className="hover:text-ruby transition-colors">
            {t.nav.problem}
          </a>
          <a href="#about" onClick={(e) => handleSmoothScroll(e, "about")} className="hover:text-ruby transition-colors">
            {t.nav.about}
          </a>
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <Section213Logo priority />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <SoundToggle soundOn={soundOn} onToggle={onToggleSound} className="hidden sm:inline-flex" />
          {contactPhone ? (
            <a
              href={telHref(contactPhone)}
              className="hidden items-center gap-2 text-sm font-semibold lg:flex"
            >
              {contactPhone} <Phone className="h-4 w-4 text-ruby" />
            </a>
          ) : null}
          <Link
            href="/book"
            className="bg-brand-accent inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold text-ruby-foreground transition hover:brightness-110 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <Camera className="h-4 w-4" />
            {t.nav.bookAShoot}
          </Link>
        </div>
      </nav>

      <SoundToggle
        soundOn={soundOn}
        onToggle={onToggleSound}
        className="absolute bottom-5 right-4 z-20 sm:hidden"
      />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 pt-24 sm:px-6 sm:pb-24 md:justify-center md:px-8 md:pb-16 md:pt-28">
        <div className="hidden items-start gap-2 text-xs text-white/85 sm:text-sm md:mb-5 md:flex">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ruby" />
          <p className="max-w-md leading-snug">{t.hero.location}</p>
        </div>

        <h1 className="mt-0 font-display text-[clamp(2.15rem,9vw,2.75rem)] leading-[1.02] tracking-tight sm:max-w-2xl sm:text-4xl md:mt-0 md:max-w-3xl md:text-5xl lg:max-w-4xl lg:text-6xl">
          {t.hero.headline}
        </h1>

        <p className="mt-3 hidden max-w-xl text-sm leading-relaxed text-white/85 sm:mt-5 sm:text-base md:block md:max-w-2xl">
          {t.hero.subheadline}
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:mt-8 md:mt-10">
          <div className="hero-stair-buttons flex w-full max-w-md flex-col items-start gap-2.5 sm:gap-3">
            <a
              href="#offers"
              onClick={(e) => handleSmoothScroll(e, "offers")}
              className="hero-stair-step hero-stair-step-1 bg-brand-accent flex w-full items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-ruby-foreground shadow-lg transition hover:brightness-110 sm:text-base sm:max-w-[18rem]"
            >
              {t.hero.ctaPrimary}
              <ChevronRight className="h-4 w-4" />
            </a>
            <a
              href="#about"
              onClick={(e) => handleSmoothScroll(e, "about")}
              className="hero-stair-step hero-stair-step-2 flex w-full items-center justify-center rounded-md border border-white/30 bg-black/30 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/55 sm:max-w-[16rem]"
            >
              {t.hero.ctaSecondary}
            </a>
            <button
              type="button"
              onClick={onToggleSound}
              className="hero-stair-step hero-stair-step-3 hidden items-center justify-center gap-2 rounded-md border border-white/30 bg-black/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/55 sm:flex sm:max-w-[15rem]"
            >
              <Volume2 className="h-4 w-4" />
              {soundOn ? t.nav.soundOn : t.hero.enableSound}
            </button>
          </div>

          <div
            aria-hidden
            className="hero-visual-band flex w-full max-w-md flex-col items-start gap-1 md:mx-auto md:max-w-4xl md:flex-row md:flex-nowrap md:items-center md:justify-center md:gap-x-2 md:gap-y-0"
          >
            {t.hero.visualBand.map((step, i) => (
              <Fragment key={step}>
                {i > 0 ? (
                  <>
                    <ChevronDown
                      className="hero-visual-band-arrow hero-visual-band-arrow--mobile h-3.5 w-3.5 shrink-0 text-white/25 md:hidden"
                      style={{ ["--arrow-index" as string]: i - 1 }}
                    />
                    <span
                      className="hero-visual-band-arrow hero-visual-band-arrow--desktop hidden shrink-0 text-sm text-white/25 md:inline"
                      style={{ ["--arrow-index" as string]: i - 1 }}
                    >
                      →
                    </span>
                  </>
                ) : null}
                <span
                  className="hero-visual-band-step inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45 md:text-xs"
                  style={{ ["--band-step" as string]: i }}
                >
                  <span className="hero-visual-band-dot h-1.5 w-1.5 shrink-0 rounded-full bg-ruby/70" />
                  {step}
                </span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      <a
        href={`#${scrollTargetId}`}
        onClick={(e) => handleSmoothScroll(e, scrollTargetId)}
        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-white/55 transition hover:text-white"
        aria-label={t.hero.scrollToContent}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">{t.hero.scroll}</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </a>
    </section>
  );
}
