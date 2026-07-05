"use client";

import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { formatDisplayText } from "@/lib/i18n/display-text";
import type { Locale } from "@/lib/i18n/types";

import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { RevealInView } from "./RevealInView";
import { SectionIndex } from "./SectionIndex";

const AUTO_START_DELAY_MS = 3000;
const AUTO_ADVANCE_INTERVAL_MS = 2200;

function MethodStepCard({
  step,
  index,
  locale,
}: {
  step: { title: string; desc: string };
  index: number;
  locale: Locale;
}) {
  return (
    <article className="group flex h-[268px] flex-col border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/25 sm:h-[288px] sm:p-6 lg:h-full lg:min-h-[288px]">
      <span className="font-display text-3xl text-white/15 transition group-hover:text-ruby/80">
        0{index + 1}
      </span>
      <h3 className="mt-3 min-h-[2.75rem] font-display text-lg leading-tight tracking-wider sm:min-h-[3rem] sm:text-xl">
        {formatDisplayText(step.title, locale)}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{step.desc}</p>
    </article>
  );
}

function MethodMobileCarousel({
  steps,
  locale,
}: {
  steps: { title: string; desc: string }[];
  locale: Locale;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<CarouselApi>();
  const autoPlayedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !api) return;

    let timeoutId: number | undefined;
    let intervalId: number | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || autoPlayedRef.current) return;

        timeoutId = window.setTimeout(() => {
          if (autoPlayedRef.current) return;
          autoPlayedRef.current = true;

          const lastIndex = api.scrollSnapList().length - 1;
          let currentIndex = api.selectedScrollSnap();

          intervalId = window.setInterval(() => {
            if (currentIndex >= lastIndex) {
              window.clearInterval(intervalId);
              return;
            }

            currentIndex += 1;
            api.scrollTo(currentIndex);
          }, AUTO_ADVANCE_INTERVAL_MS);
        }, AUTO_START_DELAY_MS);
      },
      { threshold: 0.35 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [api]);

  return (
    <div ref={sectionRef} className="mt-10 sm:hidden">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          containScroll: "trimSnaps",
        }}
        className="flex flex-col gap-4"
      >
        <CarouselContent className="-ms-4">
          {steps.map((step, i) => (
            <CarouselItem key={step.title} className="basis-[85%] ps-4">
              <div className="h-full">
                <MethodStepCard step={step} index={i} locale={locale} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-center gap-4">
          <CarouselPrevious className="static h-9 w-9 translate-x-0 translate-y-0 border-white/20 bg-ink/90 text-white hover:bg-ink" />
          <CarouselNext className="static h-9 w-9 translate-x-0 translate-y-0 border-white/20 bg-ink/90 text-white hover:bg-ink" />
        </div>
      </Carousel>
    </div>
  );
}

export function Method213() {
  const { translations: t, locale } = useLanguage();
  const m = t.homeV2.method;

  return (
    <section id="about" className="bg-ink bg-ink-texture px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <RevealInView>
          <SectionIndex index={m.index} />
          <h2 className="font-display text-3xl leading-tight sm:text-5xl md:text-6xl">
            {m.title} <span className="text-ruby">{m.titleHighlight}</span>
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/65 sm:text-base">{m.subtitle}</p>
        </RevealInView>

        <MethodMobileCarousel steps={m.steps} locale={locale} />

        <div className="mt-10 hidden sm:mt-14 sm:grid sm:grid-cols-2 sm:items-stretch sm:gap-4 lg:grid-cols-4">
          {m.steps.map((step, i) => (
            <RevealInView
              key={step.title}
              className="h-full sm:[&:nth-child(2)]:delay-75 sm:[&:nth-child(3)]:delay-150 sm:[&:nth-child(4)]:delay-200"
            >
              <MethodStepCard step={step} index={i} locale={locale} />
            </RevealInView>
          ))}
        </div>
      </div>
    </section>
  );
}
