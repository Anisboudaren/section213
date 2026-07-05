import "dotenv/config";

import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

import { PrismaClient } from "../src/generated/prisma/client";
import { CASE_STUDY_SEED, MEDIA_ASSET_SEED } from "../src/lib/case-studies-seed-data";
import { hashPassword } from "../src/lib/auth/password";
import { V1_OFFER_SEED } from "../src/lib/offers/v1-seed-data";

const SUPER_ADMIN_EMAIL = "section213.agency@gmail.com";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
});

async function main() {
  await prisma.offer.deleteMany();

  for (const offer of V1_OFFER_SEED) {
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
        priceLabelFr: offer.priceLabelFr ?? null,
        active: offer.active,
        featured: offer.featured,
        studyOnly: offer.studyOnly ?? false,
        sortOrder: offer.order,
        cta: offer.cta ?? null,
        ctaFr: offer.ctaFr ?? null,
        noteEn: offer.noteEn ?? null,
        noteFr: offer.noteFr ?? null,
        metadata: offer.metadata ?? undefined,
      },
    });
  }

  console.log(`Seeded ${V1_OFFER_SEED.length} V1 offers (packs + à-la-carte).`);

  await prisma.caseStudy.deleteMany();
  for (const item of CASE_STUDY_SEED) {
    await prisma.caseStudy.create({
      data: {
        slug: item.slug,
        title: item.title,
        clientName: item.clientName,
        industry: item.industry ?? null,
        categoryLabel: item.categoryLabel ?? null,
        excerpt: item.excerpt ?? null,
        videoUrl: item.videoUrl,
        thumbnailUrl: item.thumbnailUrl ?? null,
        services: item.services,
        results: item.results,
        sections: item.sections,
        published: item.published,
        featured: item.featured,
        sortOrder: item.sortOrder,
      },
    });
  }
  console.log(`Seeded ${CASE_STUDY_SEED.length} case studies.`);

  for (const item of MEDIA_ASSET_SEED) {
    await prisma.mediaAsset.upsert({
      where: { url: item.url },
      create: {
        url: item.url,
        pathname: item.pathname,
        filename: item.filename,
        mimeType: item.mimeType,
        folder: item.folder,
        label: item.label,
      },
      update: {},
    });
  }
  console.log(`Seeded ${MEDIA_ASSET_SEED.length} media assets.`);

  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD ?? "Section213!";
  await prisma.user.upsert({
    where: { email: SUPER_ADMIN_EMAIL },
    create: {
      email: SUPER_ADMIN_EMAIL,
      passwordHash: await hashPassword(superAdminPassword),
      fullName: "Section 213",
      role: "SUPER_ADMIN",
      active: true,
    },
    update: {},
  });
  console.log(`Seeded super admin: ${SUPER_ADMIN_EMAIL}`);
  if (!process.env.SUPER_ADMIN_PASSWORD) {
    console.log(`Default super admin password: ${superAdminPassword}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
