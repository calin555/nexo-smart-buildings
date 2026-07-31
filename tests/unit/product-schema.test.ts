import { describe, expect, it } from "vitest";

import { productFormSchema } from "../../src/modules/products/schema";
import { validateProductImageMetadata } from "../../src/modules/products/image";

const validProduct = {
  name: "Senzor smart de temperatură",
  brand: "N3XO Home",
  category: "Confortul casei",
  description: "Senzor pentru automatizări de climat.",
  priceLei: "349.90",
  badge: "NOU",
  imageUrl: "https://example.com/senzor.jpg",
  illustration: "CLIMATE",
  sortOrder: "60",
  active: true,
};

describe("productFormSchema", () => {
  it("validează și convertește datele unui produs", () => {
    const result = productFormSchema.parse(validProduct);
    expect(result.priceLei).toBe(349.9);
    expect(result.sortOrder).toBe(60);
  });

  it("respinge prețurile negative și URL-urile invalide", () => {
    const result = productFormSchema.safeParse({
      ...validProduct,
      priceLei: "-1",
      imageUrl: "imagine",
    });
    expect(result.success).toBe(false);
  });

  it("respinge o categorie care nu există în meniul public", () => {
    const result = productFormSchema.safeParse({
      ...validProduct,
      category: "Categorie inventată",
    });
    expect(result.success).toBe(false);
  });
});

describe("product image validation", () => {
  it("acceptă JPG, PNG și WebP de maximum 4 MB", () => {
    expect(validateProductImageMetadata({ type: "image/jpeg", size: 1_000_000 })).toBeNull();
    expect(validateProductImageMetadata({ type: "image/webp", size: 4_000_000 })).toBeNull();
  });

  it("respinge tipurile nesigure și fișierele prea mari", () => {
    expect(validateProductImageMetadata({ type: "image/svg+xml", size: 1000 })).toContain("JPG");
    expect(validateProductImageMetadata({ type: "image/png", size: 4_000_001 })).toContain("4 MB");
  });
});
