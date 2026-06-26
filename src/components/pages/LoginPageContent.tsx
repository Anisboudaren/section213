"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LoginForm } from "@/components/admin/LoginForm";
import { Section213Logo } from "@/components/Section213Logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HERO_FALLBACK_DESKTOP } from "@/lib/hero-video-sources";

export function LoginPageContent() {
  return (
    <div className="theme-marketing grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-10 text-white lg:flex">
        <Image
          src={HERO_FALLBACK_DESKTOP}
          alt=""
          fill
          priority
          sizes="50vw"
          unoptimized
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/80 via-transparent to-ruby/10" />

        <div className="relative z-10">
          <Link href="/" className="inline-block transition-opacity hover:opacity-90">
            <Section213Logo priority size="lg" />
          </Link>
          <p className="mt-3 text-[10px] font-semibold tracking-[0.3em] text-white/50">ADMIN CRM</p>
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <h1 className="font-display text-4xl leading-[0.95] tracking-tight xl:text-5xl">
            <span className="text-ruby">DIGITALIZE YOUR BUSINESS</span>
            <span className="text-white"> — CONTENT, CODE & AUTOMATIONS.</span>
          </h1>
          <p className="text-sm leading-relaxed text-white/65 md:text-base">
            Photography, marketing, websites, apps, and automations — managed in one platform
            built for teams who ship the full client experience.
          </p>
        </div>

        <p className="relative z-10 text-xs text-white/45">
          Section 213 — CRM, forms, pixels, and analytics in one place.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center bg-mist/40 p-6 md:p-10">
        <div className="mb-8 flex w-full max-w-sm items-center justify-between lg:hidden">
          <Link href="/" className="transition-opacity hover:opacity-90">
            <Section213Logo priority size="sm" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-ruby"
          >
            <ArrowLeft className="h-3 w-3" />
            Home
          </Link>
        </div>

        <Card className="w-full max-w-sm border-ink/10 bg-card/95 shadow-md backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="font-display text-2xl tracking-wide text-ink">
              ADMIN <span className="text-ruby">SIGN IN</span>
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the Section 213 CRM.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <p className="mt-6 text-center text-xs text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-ruby">
                Back to marketing site
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
