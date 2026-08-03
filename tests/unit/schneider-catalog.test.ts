import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { productCategories } from "../../src/modules/products/categories";

type CatalogueProduct = {
  reference: string;
  sourcePage: number;
  name: string;
  description: string;
  category: string;
  imagePath: string;
};

type Catalogue = {
  catalogueCode: string;
  productCount: number;
  imageCount: number;
  products: CatalogueProduct[];
};

const catalogue = JSON.parse(
  readFileSync(path.resolve(process.cwd(), "data", "schneider-knx-products.json"), "utf8"),
) as Catalogue;

describe("catalogul Schneider Electric KNX", () => {
  it("conține toate cele 342 de referințe unice din index", () => {
    expect(catalogue.catalogueCode).toBe("LSB02779_EN");
    expect(catalogue.productCount).toBe(342);
    expect(catalogue.products).toHaveLength(342);
    expect(new Set(catalogue.products.map(({ reference }) => reference)).size).toBe(342);
  });

  it("păstrează codul, traducerea și pagina sursă pentru fiecare produs", () => {
    for (const product of catalogue.products) {
      expect(product.name).toContain(product.reference);
      expect(product.description).toContain("catalogul Schneider Electric KNX 2025");
      expect(product.sourcePage).toBeGreaterThanOrEqual(48);
      expect(product.sourcePage).toBeLessThanOrEqual(241);
      expect(productCategories).toContain(product.category);
      expect(product.imagePath).toMatch(
        /^\/images\/products\/schneider-knx\/catalogue-\d+-\d+\.webp$/,
      );
      expect(existsSync(path.resolve(process.cwd(), "public", product.imagePath.slice(1)))).toBe(
        true,
      );
    }
    expect(catalogue.imageCount).toBe(169);
  });
});
