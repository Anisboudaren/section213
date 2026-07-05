"use client";

import { UserForm, type UserFormValues } from "@/components/admin/users/UserForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UserDto } from "@/lib/actions/users";
import { adminT } from "@/lib/i18n/admin-en";
import type { CreateUserInput, UpdateUserInput } from "@/lib/schemas/user-schema";

type UserModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateUserInput | UpdateUserInput) => void | Promise<void>;
  loading?: boolean;
  canAssignAdminRoles?: boolean;
  user?: UserDto;
};

export function UserModal({
  open,
  onOpenChange,
  onSubmit,
  loading,
  canAssignAdminRoles,
  user,
}: UserModalProps) {
  const isEdit = Boolean(user);
  const formId = isEdit ? `edit-user-form-${user?.id}` : "new-user-form";

  const handleSubmit = (values: UserFormValues) => {
    if (isEdit && user) {
      void onSubmit({
        id: user.id,
        email: values.email,
        fullName: values.fullName,
        phone: values.phone || undefined,
        photoUrl: values.photoUrl?.trim() || undefined,
        role: values.role,
        active: values.active,
        password: values.password?.trim() || "",
      });
      return;
    }

    void onSubmit({
      email: values.email,
      password: values.password ?? "",
      fullName: values.fullName,
      phone: values.phone || undefined,
      photoUrl: values.photoUrl?.trim() || undefined,
      role: values.role,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95dvh] w-[calc(100%-1rem)] flex-col overflow-hidden p-0 max-sm:top-auto max-sm:bottom-0 max-sm:translate-x-[-50%] max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-2xl sm:max-w-xl">
        <DialogHeader className="border-b px-4 py-4 sm:px-6">
          <DialogTitle>
            {isEdit ? adminT("users.editUser") : adminT("users.addUser")}
          </DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <UserForm
            key={user?.id ?? "new"}
            formId={formId}
            mode={isEdit ? "edit" : "create"}
            user={user}
            onSubmit={handleSubmit}
            canAssignAdminRoles={canAssignAdminRoles}
          />
        </div>
        <DialogFooter className="gap-2 border-t px-4 py-4 sm:px-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="min-h-11">
            {adminT("common.cancel")}
          </Button>
          <Button
            variant="gold"
            type="submit"
            form={formId}
            className="min-h-11"
            disabled={loading}
          >
            {isEdit ? adminT("common.update") : adminT("common.create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
