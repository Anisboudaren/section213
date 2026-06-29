import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyDetailContent } from "@/components/pages/CaseStudyDetailContent";
import { getCaseStudiesPublic, getCaseStudyBySlug } from "@/lib/actions/case-studies";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) return { title: "Case Study — Section 213" };
  return {
    title: `${study.title} — Section 213`,
    description: study.excerpt ?? study.categoryLabel ?? study.title,
  };
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) notFound();

  const all = await getCaseStudiesPublic();
  const related = all.filter((c) => c.slug !== slug).slice(0, 3);

  return <CaseStudyDetailContent study={study} related={related} />;
}
