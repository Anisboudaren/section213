import { notFound } from "next/navigation";

import { CaseStudyEditor } from "@/components/admin/case-studies/CaseStudyEditor";
import { getCaseStudyById } from "@/lib/actions/case-studies";
import { getClients } from "@/lib/actions/clients";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditCaseStudyPage({ params }: PageProps) {
  const { id } = await params;
  const [caseStudyResult, clientsResult] = await Promise.all([
    getCaseStudyById(id),
    getClients(),
  ]);

  if (!caseStudyResult.success) notFound();

  const clients = clientsResult.success ? clientsResult.data : [];

  return <CaseStudyEditor caseStudy={caseStudyResult.data} clients={clients} />;
}
