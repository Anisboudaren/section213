import { resolveFaviconResponse } from "@/lib/favicon";

// Cached rather than force-dynamic: crawlers (Google's favicon fetcher in
// particular) time out quickly, and re-reading site settings plus refetching
// blob storage on every request made this route unreliable for them.
export const revalidate = 3600;
export const runtime = "nodejs";

export default async function Icon() {
  return resolveFaviconResponse();
}
