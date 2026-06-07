import type { Metadata } from "next";

import { HomePageV2 } from "@/components/pages/HomePageV2";

export const metadata: Metadata = {
  title: "Section 213 — Mobile Experience",
  description:
    "Section 213 home v2 — cinematic content, the 213 method, and full digital solutions. Based in Oran, Algeria.",
};

export default function HomeV2Page() {
  return <HomePageV2 />;
}
