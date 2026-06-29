"use client";

import Image from "next/image";

import { CaseStudyVideo } from "@/components/home-v2/CaseStudyVideo";
import type { CaseStudySection } from "@/lib/case-study-sections";
import { cn } from "@/lib/utils";

type CaseStudySectionsRendererProps = {
  sections: CaseStudySection[];
};

function MediaBlock({
  url,
  mediaType,
  caption,
  className,
}: {
  url: string;
  mediaType: "image" | "video";
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      {mediaType === "video" ? (
        <video src={url} controls playsInline className="w-full rounded-2xl" />
      ) : (
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
          <Image
            src={url}
            alt={caption ?? ""}
            fill
            className="object-cover"
            unoptimized={url.includes("blob.vercel-storage.com")}
          />
        </div>
      )}
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-white/55">{caption}</figcaption>
      )}
    </figure>
  );
}

export function CaseStudySectionsRenderer({ sections }: CaseStudySectionsRendererProps) {
  if (!sections.length) return null;

  return (
    <div className="space-y-14 sm:space-y-20">
      {sections.map((section) => {
        switch (section.type) {
          case "text":
            return (
              <div key={section.id} className="max-w-3xl">
                {section.heading && (
                  <h2 className="font-display text-sm uppercase tracking-[0.25em] text-white/50">
                    {section.heading}
                  </h2>
                )}
                <div
                  className={cn(
                    "whitespace-pre-wrap text-base leading-relaxed text-white/80 sm:text-lg",
                    section.heading && "mt-4",
                  )}
                >
                  {section.body}
                </div>
              </div>
            );

          case "media":
            return (
              <MediaBlock
                key={section.id}
                url={section.url}
                mediaType={section.mediaType}
                caption={section.caption}
                className={section.fullWidth ? "w-full" : "mx-auto max-w-3xl"}
              />
            );

          case "stats":
            return (
              <div key={section.id}>
                {section.heading && (
                  <h2 className="font-display text-sm uppercase tracking-[0.25em] text-white/50">
                    {section.heading}
                  </h2>
                )}
                <div
                  className={cn(
                    "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
                    section.heading && "mt-5",
                  )}
                >
                  {section.items.map((item) => (
                    <div
                      key={`${section.id}-${item.label}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    >
                      <p className="text-3xl font-bold text-ruby sm:text-4xl">{item.value}</p>
                      <p className="mt-2 text-sm text-white/60">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            );

          case "gallery":
            return (
              <div key={section.id}>
                {section.heading && (
                  <h2 className="font-display text-sm uppercase tracking-[0.25em] text-white/50">
                    {section.heading}
                  </h2>
                )}
                <div
                  className={cn(
                    "grid gap-4 sm:grid-cols-2",
                    section.heading && "mt-5",
                    section.items.length === 1 && "sm:grid-cols-1",
                  )}
                >
                  {section.items.map((item, i) => (
                    <MediaBlock
                      key={`${section.id}-${i}`}
                      url={item.url}
                      mediaType={item.mediaType}
                      caption={item.caption}
                    />
                  ))}
                </div>
              </div>
            );

          case "quote":
            return (
              <blockquote
                key={section.id}
                className="relative max-w-3xl border-l-2 border-ruby pl-6 sm:pl-8"
              >
                <p className="font-display text-2xl leading-snug text-white sm:text-3xl">
                  &ldquo;{section.text}&rdquo;
                </p>
                {section.attribution && (
                  <footer className="mt-4 text-sm text-white/55">— {section.attribution}</footer>
                )}
              </blockquote>
            );

          case "split": {
            const mediaFirst = section.mediaPosition === "left";
            const textCol = (
              <div className="flex flex-col justify-center">
                {section.heading && (
                  <h2 className="font-display text-sm uppercase tracking-[0.25em] text-white/50">
                    {section.heading}
                  </h2>
                )}
                <p
                  className={cn(
                    "whitespace-pre-wrap text-base leading-relaxed text-white/80 sm:text-lg",
                    section.heading && "mt-4",
                  )}
                >
                  {section.body}
                </p>
              </div>
            );
            const mediaCol = (
              <MediaBlock
                url={section.url}
                mediaType={section.mediaType}
                caption={section.caption}
              />
            );
            return (
              <div
                key={section.id}
                className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12"
              >
                {mediaFirst ? mediaCol : textCol}
                {mediaFirst ? textCol : mediaCol}
              </div>
            );
          }
        }
      })}
    </div>
  );
}
