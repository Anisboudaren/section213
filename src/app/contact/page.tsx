import { Suspense } from "react";

import { ContactForm } from "@/components/contact/ContactForm";
import { Skeleton } from "@/components/ui/skeleton";

function ContactFormFallback() {
  return (
    <div className="w-full max-w-md space-y-4">
      <Skeleton className="mx-auto h-10 w-40" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-11 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}

export default function ContactPage() {
  return (
    <div className="theme-marketing flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <Suspense fallback={<ContactFormFallback />}>
        <ContactForm />
      </Suspense>
    </div>
  );
}
