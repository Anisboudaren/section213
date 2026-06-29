"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bookmark,
  Heart,
  MessageCircle,
  Music2,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { PROBLEM_PHONE_REELS } from "@/lib/problem-phone-reels";
import { safePlay } from "@/lib/safe-video-play";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

function ActionButton({
  icon: Icon,
  count,
  filled = false,
}: {
  icon: LucideIcon;
  count: string;
  filled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 text-white">
      <Icon className={cn("h-6 w-6 drop-shadow-md", filled && "fill-red-500 text-red-500")} />
      <span className="text-[9px] font-semibold drop-shadow-md">{count}</span>
    </div>
  );
}

type ProblemPhoneReelsProps = {
  channels: string[];
};

export function ProblemPhoneReels({ channels }: ProblemPhoneReelsProps) {
  const { translations: t, locale } = useLanguage();
  const caseItems = t.homeV2.caseStudies.items.slice(0, PROBLEM_PHONE_REELS.length);
  const [activeIndex, setActiveIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartY = useRef<number | null>(null);

  const reel = PROBLEM_PHONE_REELS[activeIndex];
  const meta = caseItems[activeIndex];
  const channel = channels[activeIndex % channels.length];

  const goTo = useCallback((index: number) => {
    setActiveIndex(Math.max(0, Math.min(PROBLEM_PHONE_REELS.length - 1, index)));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.25),
      { threshold: [0, 0.25, 0.5] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      video.muted = !soundOn || i !== activeIndex;
      if (i === activeIndex && inView) {
        safePlay(video);
      } else {
        video.pause();
      }
    });
  }, [activeIndex, soundOn, inView]);

  useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % PROBLEM_PHONE_REELS.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [inView]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartY.current;
    if (start === null) return;
    const end = e.changedTouches[0]?.clientY ?? start;
    const delta = start - end;
    if (Math.abs(delta) > 40) {
      goTo(activeIndex + (delta > 0 ? 1 : -1));
    }
    touchStartY.current = null;
  };

  return (
    <div ref={containerRef} className="relative isolate mx-auto max-w-[280px] overflow-hidden sm:max-w-xs">
      <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-ruby/20 via-transparent to-transparent blur-2xl" />
      <div className="relative rounded-[2rem] border border-white/15 bg-gradient-to-b from-white/[0.08] to-black/40 p-3 shadow-2xl backdrop-blur-sm">
        <div
          className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
            <span className="rounded-full bg-ruby/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ruby">
              {channel}
            </span>
            <button
              type="button"
              onClick={() => setSoundOn((v) => !v)}
              className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[9px] font-semibold text-white"
              aria-label={soundOn ? t.nav.muteVideos : t.nav.unmuteVideos}
            >
              {soundOn ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
              {soundOn ? t.nav.soundOn : t.nav.tapForSound}
            </button>
          </div>

          <div className="relative aspect-[9/16]">
            {PROBLEM_PHONE_REELS.map((item, i) => (
              <video
                key={item.src}
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={item.src}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                  i === activeIndex ? "opacity-100" : "opacity-0",
                )}
                muted={!soundOn || i !== activeIndex}
                loop
                playsInline
                preload={i === 0 ? "metadata" : "none"}
              />
            ))}

            <div className="absolute right-1.5 bottom-20 z-10 flex flex-col items-center gap-3">
              <div className="mb-0.5 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-white to-ink/80">
                <span className="font-display text-[10px] text-ink">213</span>
              </div>
              <ActionButton icon={Heart} count={reel.likes} filled />
              <ActionButton icon={MessageCircle} count={reel.comments} />
              <ActionButton icon={Share2} count={reel.shares} />
              <ActionButton icon={Bookmark} count={reel.saves} />
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/55 to-transparent p-3 pt-12 text-white">
              <div className="mb-1.5 flex items-center gap-2">
                <span className="text-xs font-semibold">@section213</span>
                <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9px]">Follow</span>
              </div>
              <p className="pr-10 text-xs leading-snug">{meta?.title}</p>
              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-white/75">
                <Music2 className="h-3 w-3 shrink-0 animate-pulse" />
                <span className="truncate">{reel.sound}</span>
              </div>
              {meta?.category && (
                <p className="mt-1 text-[9px] uppercase tracking-wider text-ruby">
                  {meta.category}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 border-t border-white/10 py-2">
            {PROBLEM_PHONE_REELS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${locale === "fr" ? "Vidéo" : "Video"} ${i + 1}`}
                onClick={() => goTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === activeIndex ? "w-4 bg-ruby" : "w-1.5 bg-white/30",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
