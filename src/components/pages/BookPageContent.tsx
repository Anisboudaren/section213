"use client";

import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";

import { BookingWizard } from "@/components/booking/BookingWizard";

export function BookPageContent() {
  return (
    <div className="min-h-svh bg-gradient-to-b from-secondary/40 via-background to-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-gold">
              <span className="font-display text-sm">213</span>
            </div>
            <div className="leading-none">
              <div className="font-display text-sm tracking-wider text-ink">SECTION</div>
              <div className="text-[9px] tracking-[0.3em] text-gold">213</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <Camera className="h-3.5 w-3.5 text-gold" />
            Book a shoot
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-14">
        <div className="mb-10 text-center md:mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            Section 213 · Oran, Algeria
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-wide text-ink md:text-5xl">
            BOOK YOUR <span className="text-gold">SHOOT</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Four quick steps — date, package, location, and your details. Mock booking flow with
            live availability preview.
          </p>
        </div>

        <BookingWizard />
      </main>
    </div>
  );
}
