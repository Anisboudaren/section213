-- AlterTable
ALTER TABLE "Lead"
ADD COLUMN "submissionStatus" TEXT NOT NULL DEFAULT 'completed',
ADD COLUMN "bookingSessionId" TEXT,
ADD COLUMN "projectName" TEXT,
ADD COLUMN "location" TEXT,
ADD COLUMN "selectedPackSlug" TEXT,
ADD COLUMN "uploadedFiles" JSONB,
ADD COLUMN "estimatedTotalDzd" INTEGER,
ADD COLUMN "abandonedAt" TIMESTAMP(3),
ADD COLUMN "completedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Lead_submissionStatus_idx" ON "Lead"("submissionStatus");
CREATE INDEX "Lead_bookingSessionId_idx" ON "Lead"("bookingSessionId");
