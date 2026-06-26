import { notFound } from "next/navigation";

import { ProjectDetailView } from "@/components/admin/projects/ProjectDetailView";
import { getClients } from "@/lib/actions/clients";
import { getProject } from "@/lib/actions/projects";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [projectResult, clientsResult] = await Promise.all([getProject(id), getClients()]);

  if (!projectResult.success) {
    notFound();
  }

  const clients = clientsResult.success
    ? clientsResult.data.map((c) => ({ id: c.id, name: c.name, company: c.company }))
    : [];

  return <ProjectDetailView initialProject={projectResult.data} clients={clients} />;
}
