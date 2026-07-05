import { UsersView } from "@/components/admin/users/UsersView";
import { listUsers } from "@/lib/actions/users";

export default async function Page() {
  const users = await listUsers().catch(() => []);
  return <UsersView initialUsers={users} />;
}
