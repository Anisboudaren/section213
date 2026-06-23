"use client";

import Link from "next/link";

import { BookingWizard } from "@/components/book/BookingWizard";
import { Section213Logo } from "@/components/Section213Logo";

export function BookPageContent() {
  return (
    <div className="theme-marketing min-h-svh bg-gradient-to-b from-secondary/40 via-background to-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4 md:px-8">
          <Link href="/" className="flex items-center">
            <Section213Logo size="sm" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
        <BookingWizard />
      </main>
    </div>
  );
}
