import type { BookingFormData } from "@/lib/booking-types";

export function serializeBookingNotes(data: Partial<BookingFormData>): string {
  const payload = {
    projectName: data.projectName,
    location: data.location,
    projectType: data.projectType,
    selectedPackId: data.selectedPackId,
    alaCarteOptions: data.alaCarteOptions ?? [],
    uploadedFiles: data.uploadedFiles ?? [],
  };
  return JSON.stringify(payload);
}

export function parseBookingNotes(notes: string): Partial<{
  projectName: string;
  location: string;
  projectType: string;
  selectedPackId: string;
  alaCarteOptions: string[];
  uploadedFiles: { name: string; url: string; kind: string }[];
}> {
  if (!notes?.startsWith("{")) return {};
  try {
    return JSON.parse(notes) as ReturnType<typeof parseBookingNotes>;
  } catch {
    return {};
  }
}
