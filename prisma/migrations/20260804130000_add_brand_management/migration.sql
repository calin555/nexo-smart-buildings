CREATE TYPE "BrandLevel" AS ENUM ('STANDARD', 'PROFESSIONAL', 'LUXURY');

CREATE TABLE "brands" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "logoUrl" TEXT,
  "description" TEXT NOT NULL,
  "usageCategories" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "level" "BrandLevel" NOT NULL,
  "kitIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "officialUrl" TEXT,
  "partnershipVerified" BOOLEAN NOT NULL DEFAULT false,
  "verificationDocumentUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");
CREATE INDEX "brands_active_sortOrder_idx" ON "brands"("active", "sortOrder");

ALTER TABLE "brands" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "brands" FROM anon, authenticated;
