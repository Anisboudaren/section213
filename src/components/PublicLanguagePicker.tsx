import { useRouterState } from "@tanstack/react-router";

import { LanguagePickerDialog } from "@/components/LanguagePickerDialog";

export function PublicLanguagePicker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPrivateApp = pathname.startsWith("/admin");

  if (isPrivateApp) return null;

  return <LanguagePickerDialog requireChoice />;
}
