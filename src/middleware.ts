import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSessionFromRequest } from "@/lib/auth/session-edge";

const BYPASS_PREFIXES = ["/api", "/maintenance", "/_next"];

function isStaticAsset(pathname: string) {
  return /\.(ico|png|jpe?g|gif|webp|svg|mov|mp4|woff2?|txt|xml)$/i.test(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/favicon.ico") {
    return NextResponse.rewrite(new URL("/icon", request.url));
  }

  if (pathname.startsWith("/admin")) {
    const session = await getSessionFromRequest(request);
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname === "/login") {
    const session = await getSessionFromRequest(request);
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (BYPASS_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  if (pathname === "/contact" || pathname === "/icon" || pathname === "/apple-icon" || isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  try {
    const statusUrl = new URL("/api/site-settings/status", request.url);
    const res = await fetch(statusUrl, { cache: "no-store" });

    if (res.ok) {
      const data = (await res.json()) as { maintenanceMode?: boolean };
      if (data.maintenanceMode) {
        return NextResponse.rewrite(new URL("/maintenance", request.url));
      }
    }
  } catch {
    // Fail open — don't block the site if status check fails.
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mov|mp4|woff2?)$).*)",
    "/favicon.ico",
  ],
};
