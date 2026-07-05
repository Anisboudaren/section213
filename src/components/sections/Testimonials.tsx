"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function TestimonialCard({ quote, name }: { quote: string; name: string }) {
  return (
    <article dir="auto" className="h-full rounded-xl bg-white/90 p-6 shadow-sm backdrop-blur-[1px]">
      <p className="mb-5 text-sm leading-relaxed text-ink/80">&ldquo;{quote}&rdquo;</p>
      <div className="text-sm font-semibold text-ink">{name}</div>
    </article>
  );
}

export function Testimonials() {
  const { translations: t } = useLanguage();

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
              {t.testimonials.items.map((item) => (
                <CarouselItem
                  key={item.name}
                  className="basis-[85%] ps-4 sm:basis-1/2 lg:basis-1/3"
                >
                  <div className="h-full">
                    <TestimonialCard quote={item.quote} name={item.name} />
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
