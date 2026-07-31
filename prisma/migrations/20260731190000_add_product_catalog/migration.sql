CREATE TYPE "ProductIllustration" AS ENUM ('KIT', 'BLINDS', 'CLIMATE', 'LOCK', 'ENERGY', 'CUSTOM');

CREATE TABLE "products" (
  "id" UUID NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "brand" TEXT NOT NULL,
  "description" TEXT,
  "priceFrom" INTEGER NOT NULL,
  "category" TEXT NOT NULL,
  "badge" TEXT,
  "imageUrl" TEXT,
  "illustration" "ProductIllustration" NOT NULL DEFAULT 'CUSTOM',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
CREATE INDEX "products_active_sortOrder_idx" ON "products"("active", "sortOrder");

INSERT INTO "products" ("id", "slug", "name", "brand", "priceFrom", "category", "badge", "illustration", "sortOrder") VALUES
  ('00000000-0000-4000-8000-000000000001', 'kit-confort-apartament-2-camere', 'Kit confort pentru apartament cu 2 camere', 'NEXO Home', 249000, 'Kit-uri de automatizare', 'RECOMANDAT', 'KIT', 10),
  ('00000000-0000-4000-8000-000000000002', 'control-jaluzele-perdele', 'Pachet de control pentru jaluzele și perdele', 'NEXO Home', 189000, 'Întrerupătoare & umbrire', NULL, 'BLINDS', 20),
  ('00000000-0000-4000-8000-000000000003', 'termostat-senzor-prezenta', 'Termostat inteligent cu senzor de prezență', 'NEXO Climate', 99000, 'Confortul casei', NULL, 'CLIMATE', 30),
  ('00000000-0000-4000-8000-000000000004', 'acces-fara-cheie-locuinte', 'Sistem de acces fără cheie pentru locuință', 'NEXO Secure', 134000, 'Sisteme de securitate', 'NOU', 'LOCK', 40),
  ('00000000-0000-4000-8000-000000000005', 'monitorizare-consum-circuite', 'Monitorizare consum electric pe circuite', 'NEXO Energy', 76000, 'Energie & eficiență', NULL, 'ENERGY', 50);
