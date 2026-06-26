-- CreateEnum
CREATE TYPE "OfferCategory" AS ENUM ('media', 'brand_content', 'websites_apps', 'automations');

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "nameFr" TEXT,
    "category" "OfferCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionFr" TEXT,
    "features" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featuresFr" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "price" INTEGER,
    "priceLabel" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "cta" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Offer_slug_key" ON "Offer"("slug");

-- CreateIndex
CREATE INDEX "Offer_category_idx" ON "Offer"("category");

-- CreateIndex
CREATE INDEX "Offer_active_idx" ON "Offer"("active");

-- CreateIndex
CREATE INDEX "Offer_sortOrder_idx" ON "Offer"("sortOrder");
