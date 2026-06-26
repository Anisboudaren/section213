-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('website', 'instagram', 'facebook', 'google', 'tiktok', 'referral', 'cold', 'other');

-- CreateEnum
CREATE TYPE "LeadStage" AS ENUM ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost');

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "source" "LeadSource" NOT NULL DEFAULT 'website',
    "utmCampaign" TEXT,
    "utmMedium" TEXT,
    "referredBy" TEXT,
    "pixelEventFired" TEXT,
    "interestedIn" TEXT[],
    "stage" "LeadStage" NOT NULL DEFAULT 'new',
    "notes" TEXT NOT NULL DEFAULT '',
    "assignedTo" TEXT,
    "trackedLinkId" TEXT,
    "trackedLinkSrc" "LeadSource",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastContactedAt" TIMESTAMP(3),

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackedLink" (
    "id" TEXT NOT NULL,
    "source" "LeadSource" NOT NULL,
    "campaign" TEXT,
    "medium" TEXT,
    "slug" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "leadCount" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrackedLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_stage_idx" ON "Lead"("stage");

-- CreateIndex
CREATE INDEX "Lead_source_idx" ON "Lead"("source");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TrackedLink_slug_key" ON "TrackedLink"("slug");

-- CreateIndex
CREATE INDEX "TrackedLink_source_idx" ON "TrackedLink"("source");
