import { getAdminBadgeCounts } from "@/lib/actions/clients";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { newLeadCount, overdueProjectCount } = await getAdminBadgeCounts();

  return (
    <AdminLayoutClient
      newLeadCount={newLeadCount}
      overdueProjectCount={overdueProjectCount}
    >
      {children}
    </AdminLayoutClient>
  );
}
