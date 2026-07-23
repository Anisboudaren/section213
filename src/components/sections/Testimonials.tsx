"use client";

import Image from "next/image";
import { useMemo } from "react";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Locale } from "@/lib/i18n/types";
import type { TestimonialDto } from "@/lib/actions/testimonials";
import { cn } from "@/lib/utils";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function resolveQuote(item: TestimonialDto, locale: Locale): string {
  if (locale === "ar") return item.quoteAr || item.quoteFr || item.quoteEn;
  if (locale === "fr") return item.quoteFr || item.quoteEn;
  return item.quoteEn || item.quoteFr;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function TestimonialCard({ item, locale }: { item: TestimonialDto; locale: Locale }) {
  const quote = resolveQuote(item, locale);
  const handle = item.instagramHandle?.replace(/^@/, "");

  return (
    <article
      dir="auto"
      className="flex h-full flex-col rounded-2xl border border-ink/5 bg-white/90 p-6 shadow-sm backdrop-blur-[1px]"
    >
      <p className="mb-6 flex-1 text-sm leading-relaxed text-ink/80">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3 border-t border-ink/5 pt-4">
        {item.photoUrl ? (
          <Image
            src={item.photoUrl}
            alt={item.name}
            width={44}
            height={44}
            unoptimized={
              item.photoUrl.startsWith("http") ||
              item.photoUrl.includes("blob.vercel-storage.com")
            }
            className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-ink/10"
          />
        ) : (
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              "bg-ruby/10 text-xs font-semibold tracking-wide text-ruby ring-1 ring-ruby/15",
            )}
            aria-hidden
          >
            {getInitials(item.name)}
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-ink">{item.name}</div>
          <div className="truncate text-xs text-ink/55">
            {item.role}
            {item.company ? ` · ${item.company}` : ""}
          </div>
          {handle ? (
            <a
              href={`https://instagram.com/${handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-block truncate text-xs text-ruby/80 transition hover:text-ruby"
            >
              @{handle}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

type TestimonialsProps = {
  items: TestimonialDto[];
};

export function Testimonials({ items }: TestimonialsProps) {
  const { translations: t, locale } = useLanguage();

  const visible = useMemo(
    () =>
      [...items]
        .filter((item) => item.active)
        .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)),
    [items],
  );

  if (visible.length === 0) return null;

  return (
    <section className="px-4 pt-20 pb-10 sm:px-6 sm:pb-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center font-display text-3xl text-ink md:text-5xl">
          {t.testimonials.title}{" "}
          <span className="text-ruby">{t.testimonials.titleHighlight}</span>
        </h2>

        <div dir="ltr">
          <Carousel
            opts={{
              align: "start",
              containScroll: "trimSnaps",
            }}
            className="flex flex-col gap-4"
          >
            <CarouselContent className="-ms-4">
              {visible.map((item) => (
                <CarouselItem key={item.id} className="basis-[85%] ps-4 sm:basis-1/2 lg:basis-1/3">
                  <div className="h-full">
                    <TestimonialCard item={item} locale={locale} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-4">
              <CarouselPrevious className="static h-9 w-9 translate-x-0 translate-y-0 border-ink/20 bg-white/90 text-ink hover:bg-ink hover:text-white" />
              <CarouselNext className="static h-9 w-9 translate-x-0 translate-y-0 border-ink/20 bg-white/90 text-ink hover:bg-ink hover:text-white" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
