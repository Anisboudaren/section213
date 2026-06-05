import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { getPageMeta } from "@/lib/admin/navigation";

type AdminRoutePageProps = {
  url: string;
};

export function AdminRoutePage({ url }: AdminRoutePageProps) {
  const meta = getPageMeta(url);

  if (!meta) {
    return (
      <AdminPageShell
        title="Page"
        description="This admin page is not configured in navigation yet."
      />
    );
  }

  return (
    <AdminPageShell
      title={meta.title}
      highlight={meta.highlight}
      description={meta.description}
    />
  );
}
