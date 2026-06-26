import type { Lead } from "@/lib/types/admin";

export async function syncLeadToNotion(lead: Lead): Promise<void> {
  const token = process.env.NOTION_API_KEY;
  const databaseId = process.env.NOTION_LEADS_DATABASE_ID;
  if (!token || !databaseId) return;

  const properties: Record<string, unknown> = {
    Name: {
      title: [{ text: { content: lead.name.slice(0, 2000) } }],
    },
  };

  if (lead.email) {
    properties.Email = { email: lead.email };
  }
  if (lead.phone) {
    properties.Phone = { phone_number: lead.phone };
  }
  if (lead.wilaya) {
    properties.Wilaya = { rich_text: [{ text: { content: lead.wilaya } }] };
  }
  if (lead.preferredDate) {
    properties["Preferred Date"] = { date: { start: lead.preferredDate.slice(0, 10) } };
  }
  if (lead.objective) {
    properties.Objective = { rich_text: [{ text: { content: lead.objective } }] };
  }
  if (lead.interestedIn.length) {
    properties.Offers = {
      rich_text: [{ text: { content: lead.interestedIn.join(", ") } }],
    };
  }
  if (lead.bookingOptions?.length) {
    properties.Options = {
      rich_text: [{ text: { content: lead.bookingOptions.join(", ") } }],
    };
  }
  if (lead.notes) {
    properties.Notes = {
      rich_text: [{ text: { content: lead.notes.slice(0, 2000) } }],
    };
  }

  properties.Source = {
    select: { name: lead.source },
  };
  properties.Type = {
    select: { name: lead.submissionType === "booking" ? "Booking" : "Contact" },
  };

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion error: ${body}`);
  }
}
