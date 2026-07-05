"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MediaUploadField } from "@/components/ui/media-upload-field";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { UserDto } from "@/lib/actions/users";
import { adminT } from "@/lib/i18n/admin-en";
import { createUserSchema, userRoleSchema } from "@/lib/schemas/user-schema";

const userFormSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().optional(),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().max(40).optional(),
  photoUrl: z.string().optional(),
  role: userRoleSchema,
  active: z.boolean().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

type UserFormProps = {
  onSubmit: (values: UserFormValues) => void;
  formId: string;
  mode?: "create" | "edit";
  user?: UserDto;
  canAssignAdminRoles?: boolean;
};

export function UserForm({
  onSubmit,
  formId,
  mode = "create",
  user,
  canAssignAdminRoles = false,
}: UserFormProps) {
  const isEdit = mode === "edit";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(
      isEdit
        ? userFormSchema.superRefine((data, ctx) => {
            const password = data.password?.trim();
            if (password && password.length < 8) {
              ctx.addIssue({
                code: "custom",
                message: "Password must be at least 8 characters",
                path: ["password"],
              });
            }
          })
        : userFormSchema.extend({
            password: createUserSchema.shape.password,
          }),
    ),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phone: "",
      photoUrl: "",
      role: "MEMBER",
      active: true,
    },
  });

  useEffect(() => {
    if (!isEdit || !user) return;
    form.reset({
      email: user.email,
      password: "",
      fullName: user.fullName,
      phone: user.phone ?? "",
      photoUrl: user.photoUrl ?? "",
      role: user.role,
      active: user.active,
    });
  }, [form, isEdit, user]);

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="photoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("users.photo")}</FormLabel>
              <FormControl>
                <MediaUploadField
                  folder="clients/avatars"
                  variant="image"
                  shape="circle"
                  value={field.value || undefined}
                  onChange={(url) => field.onChange(url ?? "")}
                  className="max-w-[140px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("users.fullName")}</FormLabel>
              <FormControl>
                <Input {...field} className="min-h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("common.email")}</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="off" {...field} className="min-h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("common.phone")}</FormLabel>
              <FormControl>
                <Input type="tel" {...field} className="min-h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isEdit ? adminT("users.newPassword") : adminT("users.password")}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder={isEdit ? adminT("users.passwordKeep") : undefined}
                  {...field}
                  className="min-h-11"
                />
              </FormControl>
              {isEdit ? (
                <FormDescription>{adminT("users.passwordHint")}</FormDescription>
              ) : null}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{adminT("users.role")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="min-h-11">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MEMBER">{adminT("users.roles.member")}</SelectItem>
                  {canAssignAdminRoles ? (
                    <>
                      <SelectItem value="ADMIN">{adminT("users.roles.admin")}</SelectItem>
                      <SelectItem value="SUPER_ADMIN">{adminT("users.roles.superAdmin")}</SelectItem>
                    </>
                  ) : null}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEdit ? (
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                <div>
                  <FormLabel>{adminT("users.activeAccount")}</FormLabel>
                  <FormDescription>{adminT("users.activeAccountHint")}</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value ?? true} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        ) : null}
      </form>
    </Form>
  );
}
