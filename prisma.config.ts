import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// DIRECT_URL: unpooled Neon connection for migrations. Falls back to DATABASE_URL
// so Vercel deploys work when only the pooled URL is configured.
const databaseUrl =
  process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? env("DATABASE_URL");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
