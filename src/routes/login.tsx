import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { LoginForm } from "@/components/admin/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Sign in — Section 213 Admin" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-ink p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink to-gold/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold text-gold-foreground">
              <span className="font-display text-lg">213</span>
            </div>
            <div>
              <div className="font-display text-xl tracking-wider">SECTION 213</div>
              <div className="text-[10px] tracking-[0.3em] text-gold">ADMIN CRM</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <h1 className="font-display text-4xl leading-tight tracking-wide xl:text-5xl">
            DIGITALIZE YOUR <span className="text-gold">BUSINESS</span>
          </h1>
          <p className="text-sm leading-relaxed text-white/70 md:text-base">
            Photography, marketing, sponsors, websites, apps, and automations — managed in one
            platform built for teams who ship the full client experience.
          </p>
        </div>

        <p className="relative z-10 text-xs text-white/50">
          Section 213 — CRM, forms, pixels, and analytics in one place.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center bg-secondary/30 p-6 md:p-10">
        <div className="mb-8 flex w-full max-w-sm items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink text-gold">
              <span className="font-display text-sm">213</span>
            </div>
            <span className="font-display tracking-wide text-ink">SECTION 213</span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Home
          </Link>
        </div>

        <Card className="w-full max-w-sm border-ink/10 shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="font-display text-2xl tracking-wide text-ink">
              ADMIN <span className="text-gold">SIGN IN</span>
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the Section 213 CRM.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <p className="mt-6 text-center text-xs text-muted-foreground">
              <Link to="/" className="hover:text-gold transition-colors">
                Back to marketing site
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
