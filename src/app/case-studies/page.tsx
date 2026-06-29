import type { Metadata } from "next";

import { CaseStudiesPageContent } from "@/components/pages/CaseStudiesPageContent";
import { getCaseStudiesPublic } from "@/lib/actions/case-studies";

export const metadata: Metadata = {
  title: "Case Studies — Section 213",
  description: "Cinematic real-estate content that builds trust before the visit.",
};

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudiesPublic();
  return <CaseStudiesPageContent caseStudies={caseStudies} />;
}
