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

const SWIPE_THRESHOLD_PX = 40;
const SLIDE_GAP_RATIO = 0.88;

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
  const p = t.homeV2.problem;
  const reelCount = PROBLEM_PHONE_REELS.length;
  const initialIndex = Math.floor(reelCount / 2);
  const caseItems = t.homeV2.caseStudies.items.slice(0, PROBLEM_PHONE_REELS.length);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [soundOn, setSoundOn] = useState(false);
  const [inView, setInView] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const slideWidthRef = useRef(260);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const activeIndexRef = useRef(activeIndex);
  const isDraggingRef = useRef(false);

  activeIndexRef.current = activeIndex;

  const channel = channels[activeIndex % channels.length];
  const wrapIndex = useCallback((index: number) => {
    return (index + reelCount) % reelCount;
  }, [reelCount]);

  const goTo = useCallback((index: number) => {
    setActiveIndex(wrapIndex(index));
    setDragOffset(0);
  }, [wrapIndex]);

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
    const screen = screenRef.current;
    if (!screen) return;

    const measure = () => {
      slideWidthRef.current = screen.clientWidth * SLIDE_GAP_RATIO;
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(screen);
    return () => observer.disconnect();
  }, []);

  const syncVideoPlayback = useCallback(
    (index: number, audible: boolean) => {
      videoRefs.current.forEach((video, i) => {
        if (!video) return;

        const isActive = i === index;
        video.muted = !audible || !isActive;

        if (isActive && inView) {
          if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
            video.load();
          }
          safePlay(video);
        } else {
          video.pause();
        }
      });
    },
    [inView],
  );

  useEffect(() => {
    syncVideoPlayback(activeIndex, soundOn);
  }, [activeIndex, soundOn, syncVideoPlayback]);

  const handleVideoCanPlay = useCallback(
    (index: number) => {
      if (index !== activeIndexRef.current || !inView) return;
      const video = videoRefs.current[index];
      if (!video) return;
      video.muted = !soundOn || index !== activeIndexRef.current;
      safePlay(video);
    },
    [inView, soundOn],
  );

  const getLoopOffset = useCallback((index: number, current: number) => {
    const direct = index - current;
    const wrapRight = direct - reelCount;
    const wrapLeft = direct + reelCount;
    return [direct, wrapRight, wrapLeft].reduce((best, candidate) =>
      Math.abs(candidate) < Math.abs(best) ? candidate : best
    );
  }, [reelCount]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartOffset.current = dragOffset;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const delta = e.clientX - dragStartX.current;
    setDragOffset(dragStartOffset.current + delta);
  };

  const finishDrag = (clientX: number) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    const delta = clientX - dragStartX.current;

    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      goTo(activeIndexRef.current + (delta < 0 ? 1 : -1));
    } else {
      setDragOffset(0);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(e.clientX);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    finishDrag(e.clientX);
  };

  return (
    <div
      ref={containerRef}
      className="relative isolate mx-auto w-full max-w-[320px] overflow-visible sm:max-w-[340px]"
    >
      <div className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-ruby/20 via-transparent to-transparent blur-2xl" />
      <div dir="ltr" className="relative rounded-[2rem] border border-white/15 bg-gradient-to-b from-white/[0.08] to-black/40 p-3 shadow-2xl backdrop-blur-sm">
        <div className="relative overflow-visible rounded-[1.5rem] border border-white/10 bg-black">
          <div className="flex items-center justify-between rounded-t-[1.5rem] border-b border-white/10 bg-black px-3 py-2">
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

          <div
            ref={screenRef}
            className="relative aspect-[9/16] touch-pan-y overflow-visible select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            {PROBLEM_PHONE_REELS.map((item, i) => {
              const meta = caseItems[i];
              const offset = getLoopOffset(i, activeIndex);
              const slideStep = slideWidthRef.current;
              const translateX = offset * slideStep + dragOffset;
              const isActive = i === activeIndex;
              const isAdjacent = Math.abs(offset) === 1;
              const isVisible = Math.abs(offset) <= 1 || isDragging;

              return (
                <div
                  key={item.src}
                  className={cn(
                    "phone-reel-slide absolute top-0 left-1/2 h-full w-[92%] origin-center overflow-hidden rounded-xl border border-white/10 bg-black shadow-xl",
                    !isDragging && "phone-reel-slide--snapping",
                    !isVisible && "pointer-events-none",
                  )}
                  style={{
                    transform: `translateX(calc(-50% + ${translateX}px)) scale(${isActive ? 1 : 0.88})`,
                    zIndex: isActive ? 3 : isAdjacent ? 1 : 0,
                    opacity: isVisible ? (isActive ? 1 : isAdjacent ? 0.55 : 0) : 0,
                  }}
                  aria-hidden={!isActive}
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[i] = el;
                    }}
                    src={item.src}
                    className="h-full w-full object-cover"
                    muted={!soundOn || i !== activeIndex}
                    loop
                    playsInline
                    preload="auto"
                    onCanPlay={() => handleVideoCanPlay(i)}
                    onLoadedData={() => handleVideoCanPlay(i)}
                  />

                  <div className="absolute right-1.5 bottom-20 z-10 flex flex-col items-center gap-3">
                    <div className="mb-0.5 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-white to-ink/80">
                      <span className="font-display text-[10px] text-ink">213</span>
                    </div>
                    <ActionButton icon={Heart} count={item.likes} filled />
                    <ActionButton icon={MessageCircle} count={item.comments} />
                    <ActionButton icon={Share2} count={item.shares} />
                    <ActionButton icon={Bookmark} count={item.saves} />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/95 via-black/55 to-transparent p-3 pt-12 text-white">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-xs font-semibold">@section213</span>
                      <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9px]">{p.follow}</span>
                    </div>
                    <p className="pe-10 text-xs leading-snug">{meta?.title}</p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-white/75">
                      <Music2 className="h-3 w-3 shrink-0 animate-pulse" />
                      <span className="truncate">{p.reelSounds[i] ?? item.sound}</span>
                    </div>
                    {meta?.category && (
                      <p className="mt-1 text-[9px] uppercase tracking-wider text-ruby">
                        {meta.category}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-1.5 rounded-b-[1.5rem] border-t border-white/10 bg-black py-2">
            {PROBLEM_PHONE_REELS.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${locale === "fr" ? "Vidéo" : locale === "ar" ? "فيديو" : "Video"} ${i + 1}`}
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
