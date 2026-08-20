import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/login", "/api/", "/maintenance", "/home-2"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
