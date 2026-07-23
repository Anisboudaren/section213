"use server";

import { getTestimonialsPublic as getTestimonialsPublicAction } from "@/lib/actions/testimonials";

export async function getTestimonialsPublic() {
  return getTestimonialsPublicAction();
}
