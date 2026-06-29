import { CaseStudiesView } from "@/components/admin/case-studies/CaseStudiesView";
import { getCaseStudiesAdmin } from "@/lib/actions/case-studies";

export default async function CaseStudiesPage() {
  const result = await getCaseStudiesAdmin();
  const caseStudies = result.success ? result.data : [];

  return <CaseStudiesView initialCaseStudies={caseStudies} />;
}
