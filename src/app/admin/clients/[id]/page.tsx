import { notFound } from "next/navigation";

import { ClientDetailView } from "@/components/admin/clients/ClientDetailView";
import { getClient } from "@/lib/actions/clients";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getClient(id);

  if (!result.success) {
    notFound();
  }

  return <ClientDetailView initialClient={result.data} />;
}
