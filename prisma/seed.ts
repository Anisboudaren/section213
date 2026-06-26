import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

import { PrismaClient } from "../src/generated/prisma/client";
import { MOCK_OFFERS } from "../src/lib/mock-data/offers";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
});

async function main() {
  const count = await prisma.offer.count();
  if (count > 0) {
    console.log(`Skipping seed: ${count} offer(s) already in database.`);
    return;
  }

  for (const offer of MOCK_OFFERS) {
    await prisma.offer.create({
      data: {
        slug: offer.slug,
        name: offer.name,
        nameAr: offer.nameAr ?? null,
        nameFr: offer.nameFr ?? null,
        category: offer.category,
        description: offer.description,
        descriptionFr: offer.descriptionFr ?? null,
        features: offer.features,
        featuresFr: offer.featuresFr ?? [],
        price: offer.price ?? null,
        priceLabel: offer.priceLabel ?? null,
        active: offer.active,
        featured: offer.featured,
        sortOrder: offer.order,
        cta: offer.cta ?? null,
      },
    });
  }

  console.log(`Seeded ${MOCK_OFFERS.length} offers.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
