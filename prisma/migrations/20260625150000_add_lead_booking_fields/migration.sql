-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "submissionType" TEXT NOT NULL DEFAULT 'contact',
ADD COLUMN     "wilaya" TEXT,
ADD COLUMN     "preferredDate" TIMESTAMP(3),
ADD COLUMN     "preferredTime" TEXT,
ADD COLUMN     "isFlexible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "projectTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "projectDescription" TEXT,
ADD COLUMN     "objective" TEXT,
ADD COLUMN     "budgetRange" TEXT,
ADD COLUMN     "bookingOptions" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "depositChoice" TEXT,
ADD COLUMN     "depositMethod" TEXT,
ADD COLUMN     "transferProofUrl" TEXT;

-- CreateIndex
CREATE INDEX "Lead_submissionType_idx" ON "Lead"("submissionType");
