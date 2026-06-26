import { readFile } from "node:fs/promises";
import path from "node:path";

import { getSiteSettings } from "@/lib/actions/site-settings";

const DEFAULT_FAVICON_FILE = path.join(
  process.cwd(),
  "public/branding/default-favicon.ico",
);

function guessContentType(url: string): string {
  const lower = url.toLowerCase();
  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".ico")) return "image/x-icon";
  return "image/png";
}

async function readDefaultFavicon(): Promise<Response> {
  const body = await readFile(DEFAULT_FAVICON_FILE);
  return new Response(body, {
    headers: {
      "Content-Type": "image/x-icon",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}

/** Serves the active favicon from site settings or the bundled default. */
export async function resolveFaviconResponse(): Promise<Response> {
  try {
    const settings = await getSiteSettings();
    const custom = settings.faviconUrl?.trim();

    if (custom) {
      try {
        const res = await fetch(custom, { cache: "no-store" });
        if (res.ok) {
          const body = await res.arrayBuffer();
          const contentType = res.headers.get("content-type") || guessContentType(custom);
          return new Response(body, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
            },
          });
        }
      } catch {
        /* fall through to default */
      }
    }
  } catch {
    /* fall through to default */
  }

  try {
    return await readDefaultFavicon();
  } catch {
    return new Response("Favicon not found", { status: 404 });
  }
}
