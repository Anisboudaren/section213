"use client";

import { useMemo, useState } from "react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";

import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { EmptyState } from "@/components/admin/EmptyState";
import { UserCard } from "@/components/admin/users/UserCard";
import { UserModal } from "@/components/admin/users/UserModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createUser, updateUser, type UserDto } from "@/lib/actions/users";
import { canManageUsers, useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { adminT } from "@/lib/i18n/admin-en";
import type { CreateUserInput, UpdateUserInput } from "@/lib/schemas/user-schema";

type UsersViewProps = {
  initialUsers: UserDto[];
};

export function UsersView({ initialUsers }: UsersViewProps) {
  const currentUser = useCurrentUser();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return users;
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.phone?.toLowerCase().includes(q),
    );
  }, [search, users]);

  const openCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (user: UserDto) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleCreate = async (values: CreateUserInput) => {
    setLoading(true);
    try {
      const result = await createUser(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setUsers((prev) => [result.data, ...prev]);
      toast.success(adminT("users.created"));
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values: UpdateUserInput) => {
    setLoading(true);
    try {
      const result = await updateUser(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setUsers((prev) => prev.map((user) => (user.id === result.data.id ? result.data : user)));
      toast.success(adminT("users.updated"));
      setModalOpen(false);
      setEditingUser(null);
    } finally {
      setLoading(false);
    }
  };

  if (!canManageUsers(currentUser)) {
    return (
      <AdminPageShell title={adminT("users.title")} description={adminT("users.noAccess")} />
    );
  }

  return (
    <AdminPageShell
      title={adminT("users.title")}
      description={adminT("users.count", { count: users.length })}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Button
            variant="gold"
            className="min-h-11 w-full lg:w-auto"
            onClick={openCreate}
          >
            <Plus className="mr-2 h-4 w-4" />
            {adminT("users.addUser")}
          </Button>
          <Input
            placeholder={adminT("users.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-h-11 w-full lg:max-w-xs"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={adminT("users.emptyTitle")}
            description={adminT("users.emptyDescription")}
            action={{ label: adminT("users.addUser"), onClick: openCreate }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((user) => (
              <UserCard key={user.id} user={user} onEdit={openEdit} />
            ))}
          </div>
        )}
      </div>

      <UserModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) setEditingUser(null);
        }}
        user={editingUser ?? undefined}
        onSubmit={(values) =>
          editingUser ? handleUpdate(values as UpdateUserInput) : handleCreate(values as CreateUserInput)
        }
        loading={loading}
        canAssignAdminRoles={currentUser.adminAccess === "full"}
      />
    </AdminPageShell>
  );
}
