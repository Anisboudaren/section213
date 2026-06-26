-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "trustedSectionIndex" TEXT NOT NULL DEFAULT '003',
ADD COLUMN     "trustedTitleEn" TEXT,
ADD COLUMN     "trustedTitleHighlightEn" TEXT,
ADD COLUMN     "trustedSubtitleEn" TEXT,
ADD COLUMN     "trustedTitleFr" TEXT,
ADD COLUMN     "trustedTitleHighlightFr" TEXT,
ADD COLUMN     "trustedSubtitleFr" TEXT;

-- CreateTable
CREATE TABLE "TrustedPartner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "linkUrl" TEXT,
    "whiteFilter" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrustedPartner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrustedPartner_active_sortOrder_idx" ON "TrustedPartner"("active", "sortOrder");
