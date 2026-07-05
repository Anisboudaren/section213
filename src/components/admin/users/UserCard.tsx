"use client";

import { Pencil } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserDto } from "@/lib/actions/users";
import { adminT } from "@/lib/i18n/admin-en";

type UserCardProps = {
  user: UserDto;
  onEdit: (user: UserDto) => void;
};

function roleLabel(role: UserDto["role"]) {
  switch (role) {
    case "SUPER_ADMIN":
      return adminT("users.roles.superAdmin");
    case "ADMIN":
      return adminT("users.roles.admin");
    default:
      return adminT("users.roles.member");
  }
}

export function UserCard({ user, onEdit }: UserCardProps) {
  const initials = user.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="rounded-xl border border-ink/10 bg-card p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14">
          {user.photoUrl ? <AvatarImage src={user.photoUrl} alt="" className="object-cover" /> : null}
          <AvatarFallback className="bg-ink text-sm text-white">{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-ink">{user.fullName}</h3>
            <Badge variant={user.role === "SUPER_ADMIN" ? "default" : "secondary"}>
              {roleLabel(user.role)}
            </Badge>
            {!user.active ? (
              <Badge variant="outline">{adminT("common.inactive")}</Badge>
            ) : null}
          </div>
          <p className="mt-1 truncate text-sm text-muted-foreground">{user.email}</p>
          {user.phone ? <p className="mt-1 text-sm text-muted-foreground">{user.phone}</p> : null}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={() => onEdit(user)}
          aria-label={adminT("users.editUser")}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}
