import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";

export const revalidate = 3600;

/**
 * Public routes only. Case-study detail pages are not listed yet: the only
 * available query helper is the admin-authenticated one, so enumerating them
 * here would need a public published-case-studies query first.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = new Date();

  return [
    { url: `${base}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/case-studies`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/book`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/contact`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];
}
