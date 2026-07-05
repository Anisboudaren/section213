-- CreateTable
CREATE TABLE "PixelSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "metaPixelId" TEXT,
    "metaAccessToken" TEXT,
    "tiktokPixelId" TEXT,
    "ga4MeasurementId" TEXT,
    "googleAdsConversionId" TEXT,
    "snapchatPixelId" TEXT,
    "activePixels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "testMode" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PixelSettings_pkey" PRIMARY KEY ("id")
);
