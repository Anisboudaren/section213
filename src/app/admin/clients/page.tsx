import { getClients } from "@/lib/actions/clients";
import { ClientsView } from "@/components/admin/clients/ClientsView";

export default async function ClientsPage() {
  const result = await getClients();
  const clients = result.success ? result.data : [];

  return <ClientsView initialClients={clients} />;
}
