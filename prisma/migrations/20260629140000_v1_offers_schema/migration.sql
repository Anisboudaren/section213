-- Reset offers and migrate to V1 pack / à-la-carte categories

DELETE FROM "Offer";

ALTER TYPE "OfferCategory" RENAME TO "OfferCategory_old";

CREATE TYPE "OfferCategory" AS ENUM ('pack', 'ala_carte');

ALTER TABLE "Offer"
  ALTER COLUMN "category" TYPE "OfferCategory"
  USING 'pack'::"OfferCategory";

DROP TYPE "OfferCategory_old";

ALTER TABLE "Offer" ADD COLUMN IF NOT EXISTS "priceLabelFr" TEXT;
ALTER TABLE "Offer" ADD COLUMN IF NOT EXISTS "studyOnly" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Offer" ADD COLUMN IF NOT EXISTS "ctaFr" TEXT;
ALTER TABLE "Offer" ADD COLUMN IF NOT EXISTS "noteEn" TEXT;
ALTER TABLE "Offer" ADD COLUMN IF NOT EXISTS "noteFr" TEXT;
ALTER TABLE "Offer" ADD COLUMN IF NOT EXISTS "metadata" JSONB;
