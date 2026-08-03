import { ProductIllustration } from "@prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import { prisma } from "../src/lib/prisma";
import { productCategories } from "../src/modules/products/categories";

const catalogueSchema = z.object({
  source: z.literal("ABB official product information API"),
  sourceUrl: z.string().url(),
  catalogueCode: z.literal("ABB_I_BUS_KNX_RO_PHASE_1"),
  market: z.literal("RO"),
  selectionPolicy: z.string().min(10),
  productCount: z.number().int().positive(),
  imageCount: z.number().int().positive(),
  products: z.array(
    z.object({
      reference: z.string().regex(/^[A-Z0-9][A-Z0-9_.\/-]{4,39}$/),
      sourceCategory: z.enum([
        "Surse de alimentare",
        "Infrastructură și interfețe",
        "Intrări",
        "Ieșiri",
      ]),
      sourceCategoryId: z.string().regex(/^9AAC\d+$/),
      name: z.string().min(5).max(140),
      description: z.string().min(80).max(500),
      category: z.enum(productCategories),
      imagePath: z.string().regex(/^\/images\/products\/abb-knx\/[a-z0-9-]+\.(?:png|jpe?g|webp)$/),
      officialImageUrl: z.string().url(),
      illustration: z.nativeEnum(ProductIllustration),
      sortOrder: z.number().int().min(2100).max(2999),
    }),
  ),
});

function productSlug(reference: string): string {
  return `abb-knx-${reference
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

async function main(): Promise<void> {
  const cataloguePath = path.resolve(process.cwd(), "data", "abb-knx-products.json");
  const catalogue = catalogueSchema.parse(JSON.parse(await readFile(cataloguePath, "utf8")));
  const uniqueReferences = new Set(catalogue.products.map(({ reference }) => reference));
  if (
    uniqueReferences.size !== catalogue.productCount ||
    catalogue.products.length !== catalogue.productCount ||
    catalogue.imageCount !== catalogue.productCount
  ) {
    throw new Error("Catalogul ABB KNX conține referințe duplicate sau este incomplet.");
  }

  const batchSize = 40;
  for (let index = 0; index < catalogue.products.length; index += batchSize) {
    const batch = catalogue.products.slice(index, index + batchSize);
    await prisma.$transaction(
      batch.map((product) => {
        const slug = productSlug(product.reference);
        const shared = {
          name: product.name,
          brand: "ABB",
          description: product.description,
          imageUrl: product.imagePath,
          category: product.category,
          badge: "KNX",
          illustration: product.illustration,
          active: true,
          sortOrder: product.sortOrder,
        };
        return prisma.product.upsert({
          where: { slug },
          update: shared,
          create: { slug, ...shared, priceFrom: 0 },
        });
      }),
    );
  }

  await prisma.auditLog.create({
    data: {
      action: "ABB_KNX_CATALOG_IMPORTED",
      entityType: "ProductCatalog",
      entityId: catalogue.catalogueCode,
      metadata: {
        source: catalogue.source,
        sourceUrl: catalogue.sourceUrl,
        selectionPolicy: catalogue.selectionPolicy,
        productCount: catalogue.productCount,
        importedAt: new Date().toISOString(),
      },
    },
  });

  const slugs = catalogue.products.map(({ reference }) => productSlug(reference));
  const storedProducts = await prisma.product.count({ where: { slug: { in: slugs } } });
  if (storedProducts !== catalogue.productCount) {
    throw new Error(
      `Verificarea post-import a eșuat: ${storedProducts} produse găsite, ${catalogue.productCount} așteptate.`,
    );
  }
  console.log(`Catalogul ABB KNX a fost verificat în bază: ${storedProducts} produse unice.`);
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Importul catalogului ABB a eșuat.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
