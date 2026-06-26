"use client";

import { useEffect, useRef } from "react";

import { safePlay } from "@/lib/safe-video-play";

type CaseStudyVideoProps = {
  src: string;
  className?: string;
};

/** Loads and plays a case-study clip only when the card is near the viewport. */
export function CaseStudyVideo({ src, className }: CaseStudyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          el.pause();
          return;
        }

        if (!el.src) {
          el.src = src;
          el.load();
        }

        safePlay(el);
      },
      { rootMargin: "240px", threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      muted
      loop
      playsInline
      preload="none"
    />
  );
}
