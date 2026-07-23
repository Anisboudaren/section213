import { TestimonialsView } from "@/components/admin/testimonials/TestimonialsView";
import { getTestimonialsAdmin } from "@/lib/actions/testimonials";

export default async function TestimonialsAdminPage() {
  const result = await getTestimonialsAdmin();
  const testimonials = result.success ? result.data : [];

  return <TestimonialsView initialTestimonials={testimonials} />;
}
