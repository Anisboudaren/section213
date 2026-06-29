-- Extend SiteSettings with public contact page fields
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "contactAddress" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "contactCity" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "contactHoursFr" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "contactHoursEn" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "tiktokHandle" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "youtubeUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "linkedinUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "mapsUrl" TEXT;
