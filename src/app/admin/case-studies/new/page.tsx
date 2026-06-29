import { CaseStudyEditor } from "@/components/admin/case-studies/CaseStudyEditor";
import { getClients } from "@/lib/actions/clients";

export default async function NewCaseStudyPage() {
  const clientsResult = await getClients();
  const clients = clientsResult.success ? clientsResult.data : [];

  return <CaseStudyEditor clients={clients} />;
}
