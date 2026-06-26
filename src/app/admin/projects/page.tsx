import { Suspense } from "react";

import { ProjectsView } from "@/components/admin/projects/ProjectsView";
import { getClients } from "@/lib/actions/clients";
import { getProjects } from "@/lib/actions/projects";

export default async function ProjectsPage() {
  const [projectsResult, clientsResult] = await Promise.all([
    getProjects(),
    getClients(),
  ]);

  const projects = projectsResult.success ? projectsResult.data : [];
  const clients = clientsResult.success
    ? clientsResult.data.map((c) => ({ id: c.id, name: c.name, company: c.company }))
    : [];

  return (
    <Suspense>
      <ProjectsView initialProjects={projects} clients={clients} />
    </Suspense>
  );
}
