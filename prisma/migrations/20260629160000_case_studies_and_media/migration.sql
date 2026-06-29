-- Case studies portfolio + media asset library

CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "clientId" TEXT,
    "clientName" TEXT NOT NULL,
    "industry" TEXT,
    "categoryLabel" TEXT,
    "excerpt" TEXT,
    "videoUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "services" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "results" JSONB NOT NULL DEFAULT '[]',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "folder" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL DEFAULT 0,
    "label" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");
CREATE INDEX "CaseStudy_published_sortOrder_idx" ON "CaseStudy"("published", "sortOrder");

CREATE UNIQUE INDEX "MediaAsset_url_key" ON "MediaAsset"("url");
CREATE UNIQUE INDEX "MediaAsset_pathname_key" ON "MediaAsset"("pathname");
CREATE INDEX "MediaAsset_folder_idx" ON "MediaAsset"("folder");
CREATE INDEX "MediaAsset_mimeType_idx" ON "MediaAsset"("mimeType");
CREATE INDEX "MediaAsset_createdAt_idx" ON "MediaAsset"("createdAt" DESC);

ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
