import type { Lead } from "@/lib/types/admin";

function formatLeadSummary(lead: Lead): string {
  const lines = [
    `New lead: ${lead.name}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.company ? `Company: ${lead.company}` : null,
    lead.wilaya ? `Wilaya: ${lead.wilaya}` : null,
    lead.preferredDate ? `Preferred date: ${lead.preferredDate}` : null,
    lead.objective ? `Objective: ${lead.objective}` : null,
    lead.budgetRange ? `Budget: ${lead.budgetRange}` : null,
    lead.interestedIn.length ? `Offers: ${lead.interestedIn.join(", ")}` : null,
    lead.bookingOptions?.length ? `Options: ${lead.bookingOptions.join(", ")}` : null,
    lead.depositChoice ? `Deposit: ${lead.depositChoice}` : null,
    lead.notes ? `Notes: ${lead.notes}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

export async function notifyTeamEmail(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.TEAM_NOTIFICATION_EMAIL;
  if (!apiKey || !to) return;

  const from = process.env.TEAM_NOTIFICATION_FROM ?? "Section 213 <noreply@section213.dz>";

  const subject =
    lead.submissionType === "booking"
      ? `[Réservation] ${lead.name}`
      : `[Contact] ${lead.name}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text: formatLeadSummary(lead),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error: ${body}`);
  }
}
