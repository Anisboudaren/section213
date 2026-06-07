import type { Metadata } from "next";

import { BookPageContent } from "@/components/pages/BookPageContent";

export const metadata: Metadata = {
  title: "Book a Shoot",
  description:
    "Schedule your photo or video shoot with Section 213. Pick a date, choose a package, and tell us where to meet you.",
};

export default function Page() {
  return <BookPageContent />;
}
