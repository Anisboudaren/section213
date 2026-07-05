import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";

import { Providers } from "@/components/providers";
import { getPublicPixelSettings } from "@/lib/actions/pixel-settings";
import { getSiteSettings } from "@/lib/actions/site-settings";
import { getAccentPreset, getAccentPresetStyleProperties } from "@/lib/accent-presets";

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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const iconVersion = settings.updatedAt.replace(/[:.]/g, "");

  return {
    title: {
      default: settings.siteTitle,
      template: `%s — ${settings.siteName}`,
    },
    description: settings.siteDescription,
    authors: [{ name: settings.siteName }],
    icons: {
      icon: [{ url: `/icon?v=${iconVersion}` }],
      apple: [{ url: `/apple-icon?v=${iconVersion}` }],
      shortcut: [{ url: `/icon?v=${iconVersion}` }],
    },
    openGraph: {
      title: settings.siteTitle,
      description: settings.siteDescription,
      type: "website",
      ...(settings.ogImageUrl ? { images: [settings.ogImageUrl] } : {}),
    },
    twitter: {
      card: "summary",
      title: settings.siteTitle,
      description: settings.siteDescription,
      ...(settings.ogImageUrl ? { images: [settings.ogImageUrl] } : {}),
    },
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

  return (
    <html
      lang={settings.defaultLocale}
      data-accent-preset={settings.accentPresetId}
      className={`${inter.variable} ${anton.variable}`}
      style={accentStyles}
    >
      <head>
        <link rel="preconnect" href="https://bbrpqquawbvqnrpw.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://bbrpqquawbvqnrpw.public.blob.vercel-storage.com" />
      </head>
      <body>
        <Providers siteSettings={settings} pixelSettings={pixelSettings}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
