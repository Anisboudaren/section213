import type { Metadata } from "next";

import { HomePageV2 } from "@/components/pages/HomePageV2";
import { getWebsiteClients } from "@/lib/queries/website-clients";

export const metadata: Metadata = {
  title: "Section 213 — Cinematic Content That Goes Viral",
  description:
    "Section 213 — based in Oran, Algeria. Photography, marketing, websites, apps, and business automations for modern brands.",
};

export default async function Page() {
  const websiteClients = await getWebsiteClients();
  return <HomePageV2 websiteClients={websiteClients} />;
}
