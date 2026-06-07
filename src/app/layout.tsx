import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";

import { Providers } from "@/components/providers";

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

export const metadata: Metadata = {
  title: {
    default: "Section 213",
    template: "%s — Section 213",
  },
  description:
    "Section 213 — based in Oran, Algeria. Photography, marketing, websites, apps, and business automations for modern brands.",
  authors: [{ name: "Section 213" }],
  openGraph: {
    title: "Section 213",
    description:
      "Section 213 — based in Oran, Algeria. Photography, marketing, websites, apps, and business automations for modern brands.",
    type: "website",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/817cc14b-4e07-44b9-82a2-b16d0b653ff9/id-preview-db619953--5900c77a-8423-4386-8c1b-4a6ef34f94c1.lovable.app-1780515916701.png",
    ],
  },
  twitter: {
    card: "summary",
    title: "Section 213",
    description:
      "Section 213 — based in Oran, Algeria. Photography, marketing, websites, apps, and business automations for modern brands.",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/817cc14b-4e07-44b9-82a2-b16d0b653ff9/id-preview-db619953--5900c77a-8423-4386-8c1b-4a6ef34f94c1.lovable.app-1780515916701.png",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
