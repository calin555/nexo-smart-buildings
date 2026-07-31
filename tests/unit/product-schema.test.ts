import { describe, expect, it } from "vitest";

import { productFormSchema } from "../../src/modules/products/schema";

const validProduct = {
  name: "Senzor smart de temperatură",
  brand: "NEXO Home",
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
    const result = productFormSchema.safeParse({ ...validProduct, priceLei: "-1", imageUrl: "imagine" });
    expect(result.success).toBe(false);
  });
});
