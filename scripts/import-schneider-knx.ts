import { ProductIllustration } from "@prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

import { prisma } from "../src/lib/prisma";
import { productCategories } from "../src/modules/products/categories";

const catalogueSchema = z.object({
  source: z.string().min(1),
  catalogueCode: z.literal("LSB02779_EN"),
  productCount: z.literal(342),
  products: z.array(
    z.object({
      reference: z.string().regex(/^(?:C2E|CCT|LSS|MTN|NP|NUX|NU|R9M)[A-Z0-9_.-]+$/),
      sourcePage: z.number().int().min(48).max(241),
      name: z.string().min(3).max(140),
      description: z.string().min(40).max(500),
      category: z.enum(productCategories),
      illustration: z.nativeEnum(ProductIllustration),
      sortOrder: z.number().int().min(1000).max(2000),
    }),
  ),
});

function productSlug(reference: string): string {
  return `schneider-knx-${reference
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

async function main(): Promise<void> {
  const cataloguePath = path.resolve(process.cwd(), "data", "schneider-knx-products.json");
  const catalogue = catalogueSchema.parse(JSON.parse(await readFile(cataloguePath, "utf8")));
  const uniqueReferences = new Set(catalogue.products.map(({ reference }) => reference));
  if (uniqueReferences.size !== catalogue.productCount) {
    throw new Error("Catalogul Schneider KNX conține referințe duplicate.");
  }

  const batchSize = 40;
  for (let index = 0; index < catalogue.products.length; index += batchSize) {
    const batch = catalogue.products.slice(index, index + batchSize);
    await prisma.$transaction(
      batch.map((product) => {
        const slug = productSlug(product.reference);
        const shared = {
          name: product.name,
          brand: "Schneider Electric",
          description: product.description,
          category: product.category,
          badge: "KNX",
          illustration: product.illustration,
          active: true,
          sortOrder: product.sortOrder,
        };
        return prisma.product.upsert({
          where: { slug },
          update: shared,
          create: {
            slug,
            ...shared,
            priceFrom: 0,
          },
        });
      }),
    );
  }

  await prisma.auditLog.create({
    data: {
      action: "SCHNEIDER_KNX_CATALOG_IMPORTED",
      entityType: "ProductCatalog",
      entityId: catalogue.catalogueCode,
      metadata: {
        source: catalogue.source,
        productCount: catalogue.productCount,
        importedAt: new Date().toISOString(),
      },
    },
  });

  const storedProducts = await prisma.product.count({
    where: { slug: { startsWith: "schneider-knx-" } },
  });
  if (storedProducts !== catalogue.productCount) {
    throw new Error(
      `Verificarea post-import a eșuat: ${storedProducts} produse găsite, ${catalogue.productCount} așteptate.`,
    );
  }
  console.log(`Catalogul Schneider KNX a fost verificat în bază: ${storedProducts} produse unice.`);
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : "Importul catalogului a eșuat.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
