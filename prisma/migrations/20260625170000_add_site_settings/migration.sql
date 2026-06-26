-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "siteName" TEXT NOT NULL DEFAULT 'Section 213',
    "siteTitle" TEXT NOT NULL DEFAULT 'Section 213',
    "siteDescription" TEXT NOT NULL DEFAULT '',
    "accentPresetId" TEXT NOT NULL DEFAULT 'midnight-ruby',
    "enabledAccentPresetIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "defaultLocale" TEXT NOT NULL DEFAULT 'fr',
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "whatsappNumber" TEXT,
    "instagramHandle" TEXT,
    "ogImageUrl" TEXT,
    "bookingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
