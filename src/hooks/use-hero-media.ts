"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { safePlay } from "@/lib/safe-video-play";

function syncVideoAudio(
  enabled: boolean,
  heroRef: React.RefObject<HTMLVideoElement | null>,
  reelRefs: React.MutableRefObject<(HTMLVideoElement | null)[]>,
  activeReelIndex: number,
  reelsVisible: boolean,
  heroVisible: boolean,
) {
  const hero = heroRef.current;
  if (hero) {
    const heroAudible = enabled && heroVisible && !reelsVisible;
    hero.muted = !heroAudible;
    hero.volume = 1;

    if (heroVisible) {
      safePlay(hero);
    } else {
      hero.pause();
    }
  }

  reelRefs.current.forEach((video, i) => {
    if (!video) return;
    const isActive = reelsVisible && i === activeReelIndex;
    video.muted = !enabled || !isActive;
    video.volume = 1;

    if (isActive) {
      safePlay(video);
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });
}

export function useHeroMedia() {
  const [soundOn, setSoundOn] = useState(false);
  const [reelsInView, setReelsInView] = useState(false);
  const [heroInView, setHeroInView] = useState(true);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const reelVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const soundOnRef = useRef(soundOn);
  const reelsInViewRef = useRef(reelsInView);
  const heroInViewRef = useRef(heroInView);
  const activeReelIndexRef = useRef(activeReelIndex);

  soundOnRef.current = soundOn;
  reelsInViewRef.current = reelsInView;
  heroInViewRef.current = heroInView;
  activeReelIndexRef.current = activeReelIndex;

  const toggleSound = useCallback(() => {
    const next = !soundOnRef.current;
    setSoundOn(next);
    syncVideoAudio(
      next,
      heroVideoRef,
      reelVideoRefs,
      activeReelIndexRef.current,
      reelsInViewRef.current,
      heroInViewRef.current,
    );
  }, []);

  const handleHeroInView = useCallback((inView: boolean) => {
    setHeroInView(inView);
    heroInViewRef.current = inView;
    syncVideoAudio(
      soundOnRef.current,
      heroVideoRef,
      reelVideoRefs,
      activeReelIndexRef.current,
      reelsInViewRef.current,
      inView,
    );
  }, []);

  const handleReelsInView = useCallback((inView: boolean) => {
    setReelsInView(inView);
    reelsInViewRef.current = inView;
    syncVideoAudio(
      soundOnRef.current,
      heroVideoRef,
      reelVideoRefs,
      activeReelIndexRef.current,
      inView,
      heroInViewRef.current,
    );
  }, []);

  const handleActiveReelChange = useCallback((index: number) => {
    setActiveReelIndex(index);
    activeReelIndexRef.current = index;
  }, []);

  useEffect(() => {
    syncVideoAudio(
      soundOn,
      heroVideoRef,
      reelVideoRefs,
      activeReelIndex,
      reelsInView,
      heroInView,
    );
  }, [soundOn, activeReelIndex, reelsInView, heroInView]);

  return {
    soundOn,
    reelsInView,
    heroInView,
    toggleSound,
    heroVideoRef,
    reelVideoRefs,
    handleHeroInView,
    handleReelsInView,
    handleActiveReelChange,
  };
}
