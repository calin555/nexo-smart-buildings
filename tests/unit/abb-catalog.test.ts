import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { productCategories } from "../../src/modules/products/categories";

type CatalogueProduct = {
  reference: string;
  sourceCategory: string;
  sourceCategoryId: string;
  name: string;
  description: string;
  category: string;
  imagePath: string;
  officialImageUrl: string;
};

type Catalogue = {
  source: string;
  catalogueCode: string;
  market: string;
  selectionPolicy: string;
  productCount: number;
  imageCount: number;
  products: CatalogueProduct[];
};

const catalogue = JSON.parse(
  readFileSync(path.resolve(process.cwd(), "data", "abb-knx-products.json"), "utf8"),
) as Catalogue;

const allowedSourceCategories = [
  "Surse de alimentare",
  "Infrastructură și interfețe",
  "Intrări",
  "Ieșiri",
];

describe("catalogul ABB i-bus KNX, etapa 1", () => {
  it("conține 126 de produse curente cu referințe unice", () => {
    expect(catalogue.source).toBe("ABB official product information API");
    expect(catalogue.catalogueCode).toBe("ABB_I_BUS_KNX_RO_PHASE_1");
    expect(catalogue.market).toBe("RO");
    expect(catalogue.selectionPolicy).toContain("without replacement");
    expect(catalogue.productCount).toBe(126);
    expect(catalogue.products).toHaveLength(126);
    expect(new Set(catalogue.products.map(({ reference }) => reference)).size).toBe(126);
  });

  it("păstrează proveniența oficială, traducerea și imaginea fiecărui produs", () => {
    for (const product of catalogue.products) {
      expect(product.name).toContain(product.reference);
      expect(product.description).toContain("ABB i-bus KNX");
      expect(product.description).toContain("Cod comercial ABB");
      expect(productCategories).toContain(product.category);
      expect(allowedSourceCategories).toContain(product.sourceCategory);
      expect(product.sourceCategoryId).toMatch(/^9AAC\d+$/);
      expect(product.officialImageUrl).toMatch(/^https:\/\/cdn\.productimages\.abb\.com\//);
      expect(product.imagePath).toMatch(
        /^\/images\/products\/abb-knx\/[a-z0-9-]+\.(?:png|jpe?g|webp)$/,
      );
      expect(existsSync(path.resolve(process.cwd(), "public", product.imagePath.slice(1)))).toBe(
        true,
      );
    }
    expect(catalogue.imageCount).toBe(catalogue.productCount);
  });
});
