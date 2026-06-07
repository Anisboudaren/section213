"use client";

import { usePathname } from "next/navigation";

import { LanguagePickerDialog } from "@/components/LanguagePickerDialog";

export function PublicLanguagePicker() {
  const pathname = usePathname();
  const isPrivateApp = pathname.startsWith("/admin");

  if (isPrivateApp) return null;

  return <LanguagePickerDialog requireChoice />;
}
