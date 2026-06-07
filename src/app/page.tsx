import type { Metadata } from "next";

import { HomePage } from "@/components/pages/HomePage";

export const metadata: Metadata = {
  title: "Section 213 — Cinematic Content That Goes Viral",
  description:
    "Section 213 — based in Oran, Algeria. Photography, marketing, websites, apps, and business automations for modern brands.",
};

export default function Page() {
  return <HomePage />;
}
