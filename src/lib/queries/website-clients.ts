"use server";

import { prisma } from "@/lib/prisma";

export type WebsiteClientLogo = {
  name: string;
  image: string;
  whiteFilter?: boolean;
};

export async function getWebsiteClients(): Promise<WebsiteClientLogo[]> {
  try {
    const clients = await prisma.client.findMany({
      where: {
        showOnWebsite: true,
        logoUrl: { not: null },
      },
      orderBy: { company: "asc" },
      select: {
        company: true,
        logoUrl: true,
      },
    });

    if (clients.length === 0) return [];

    return clients.map((c) => ({
      name: c.company,
      image: c.logoUrl!,
      whiteFilter: true,
    }));
  } catch {
    return [];
  }
}
