import type { Metadata } from "next";
import { Anton, IBM_Plex_Sans_Arabic, Inter, Tajawal } from "next/font/google";

import { Providers } from "@/components/providers";
import { getPublicPixelSettings } from "@/lib/actions/pixel-settings";
import { getSiteSettings } from "@/lib/actions/site-settings";
import { getAccentPreset, getAccentPresetStyleProperties } from "@/lib/accent-presets";
import { getSiteUrl, iconVersion, resolveOgImage } from "@/lib/seo";
import type { SiteSettingsDto } from "@/lib/site-settings-defaults";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body-ar",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["400", "700", "800"],
  variable: "--font-display-ar",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = getSiteUrl();
  const ogImage = resolveOgImage(settings.ogImageUrl);
  const iconV = iconVersion(settings.faviconUrl);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.siteTitle,
      template: `%s — ${settings.siteName}`,
    },
    description: settings.siteDescription,
    authors: [{ name: settings.siteName }],
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [{ url: `/icon?v=${iconV}`, type: "image/png", sizes: "512x512" }],
      apple: [{ url: `/apple-icon?v=${iconV}`, sizes: "180x180" }],
      shortcut: [{ url: `/icon?v=${iconV}` }],
    },
    openGraph: {
      title: settings.siteTitle,
      description: settings.siteDescription,
      type: "website",
      url: siteUrl,
      siteName: settings.siteName,
      locale: settings.defaultLocale === "en" ? "en_US" : "fr_FR",
      images: [{ url: ogImage, width: 1200, height: 630, alt: settings.siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle,
      description: settings.siteDescription,
      images: [ogImage],
    },
  };
}

/**
 * Organization schema so Google can associate the brand, logo, location and
 * social profiles with the domain. Matters for a local Oran business showing
 * up in branded and local search.
 */
function buildOrganizationJsonLd(settings: SiteSettingsDto) {
  const siteUrl = getSiteUrl();

  const sameAs = [
    settings.facebookUrl,
    settings.instagramHandle
      ? `https://www.instagram.com/${settings.instagramHandle.replace(/^@/, "")}`
      : undefined,
    settings.linkedinUrl,
    settings.youtubeUrl,
    settings.tiktokHandle
      ? `https://www.tiktok.com/@${settings.tiktokHandle.replace(/^@/, "")}`
      : undefined,
  ].filter((value): value is string => Boolean(value && value.trim()));

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#organization`,
    name: settings.siteName,
    url: siteUrl,
    description: settings.siteDescription,
    image: resolveOgImage(settings.ogImageUrl),
    logo: resolveOgImage(settings.ogImageUrl),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Oran",
      addressCountry: "DZ",
      ...(settings.contactAddress ? { streetAddress: settings.contactAddress } : {}),
    },
    areaServed: [
      { "@type": "Country", name: "Algeria" },
      { "@type": "Country", name: "Morocco" },
      { "@type": "Country", name: "Tunisia" },
    ],
    ...(settings.contactPhone ? { telephone: settings.contactPhone } : {}),
    ...(settings.contactEmail ? { email: settings.contactEmail } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, pixelSettings] = await Promise.all([
    getSiteSettings(),
    getPublicPixelSettings(),
  ]);
  const accentPreset = getAccentPreset(settings.accentPresetId);
  const accentStyles = getAccentPresetStyleProperties(accentPreset);
  const organizationJsonLd = buildOrganizationJsonLd(settings);

  return (
    <html
      lang={settings.defaultLocale}
      data-accent-preset={settings.accentPresetId}
      className={`${inter.variable} ${anton.variable} ${ibmPlexArabic.variable} ${tajawal.variable}`}
      style={accentStyles}
    >
      <head>
        <link rel="preconnect" href="https://bbrpqquawbvqnrpw.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://bbrpqquawbvqnrpw.public.blob.vercel-storage.com" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Providers siteSettings={settings} pixelSettings={pixelSettings}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
