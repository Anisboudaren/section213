/**
 * Shared SEO helpers.
 *
 * Two problems these guard against:
 *  - NEXT_PUBLIC_SITE_URL is not set in the Vercel production environment, so
 *    anything deriving absolute URLs from it silently produced localhost or
 *    relative junk. getSiteUrl() falls back to the real canonical host.
 *  - Site settings store an operator-supplied ogImageUrl. A local Windows path
 *    (file:///C:/...) was saved at one point, which made every social share
 *    render with no preview image. resolveOgImage() refuses anything that is
 *    not an absolute https URL and falls back to the bundled logo.
 */

export const CANONICAL_SITE_URL = "https://www.section213.com";

/** Absolute origin for canonical URLs, sitemap entries and social images. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (
    fromEnv &&
    /^https:\/\//i.test(fromEnv) &&
    !/localhost|127\.0\.0\.1/i.test(fromEnv)
  ) {
    return fromEnv.replace(/\/+$/, "");
  }
  return CANONICAL_SITE_URL;
}

/** Bundled fallback used when no valid social image is configured. */
export function defaultOgImage(): string {
  return `${getSiteUrl()}/logo/main%20logo%20sectoin%20213.png`;
}

/**
 * Social crawlers only accept absolute https URLs. Anything else (empty,
 * relative, file://, http://) is rejected in favour of the bundled logo.
 */
export function resolveOgImage(raw?: string | null): string {
  const value = raw?.trim();
  if (value && /^https:\/\/[^\s]+$/i.test(value)) return value;
  return defaultOgImage();
}

/**
 * Cache-busting token for the favicon links.
 *
 * Previously this was site settings' `updatedAt`, so editing an unrelated
 * field (phone number, accent colour) changed the icon URL. Google treats a
 * moving favicon URL as a new icon to re-discover, which is part of why a
 * stale icon persisted in search results. Hashing the favicon URL means the
 * token only moves when the icon itself actually changes.
 */
export function iconVersion(faviconUrl?: string | null): string {
  const source = faviconUrl?.trim() || "default";
  let hash = 5381;
  for (let i = 0; i < source.length; i += 1) {
    hash = ((hash << 5) + hash + source.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}
