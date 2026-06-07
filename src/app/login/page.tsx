import type { Metadata } from "next";

import { LoginPageContent } from "@/components/pages/LoginPageContent";

export const metadata: Metadata = {
  title: "Sign in — Section 213 Admin",
};

export default function Page() {
  return <LoginPageContent />;
}
