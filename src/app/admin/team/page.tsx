import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { TeamCard } from "@/components/admin/TeamCard";
import { TEAM } from "@/lib/mock-data/team";
import { adminT } from "@/lib/i18n/admin-en";

export default function TeamPage() {
  return (
    <AdminPageShell title={adminT("team.title")} description={adminT("team.description")}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((member) => (
          <div key={member.id} id={`member-${member.id}`}>
            <TeamCard member={member} />
          </div>
        ))}
      </div>
    </AdminPageShell>
  );
}
