import { redirect } from "next/navigation";

import { getAdminBadgeCounts } from "@/lib/actions/clients";
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient";
import { getSessionUser } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const { newLeadCount, overdueProjectCount } = await getAdminBadgeCounts();

  return (
    <AdminLayoutClient
      user={user}
      newLeadCount={newLeadCount}
      overdueProjectCount={overdueProjectCount}
    >
      {children}
    </AdminLayoutClient>
  );
}
