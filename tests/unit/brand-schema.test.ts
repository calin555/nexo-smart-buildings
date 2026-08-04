import { describe, expect, it } from "vitest";

import { brandFormSchema } from "../../src/modules/brands/schema";

const validBrand = {
  name: "Brand Demo",
  slug: "brand-demo",
  logoUrl: "",
  description: "Descriere tehnică suficient de clară pentru un brand demonstrativ.",
  usageCategories: ["Senzori"],
  level: "PROFESSIONAL",
  kitIds: ["casa-comfort"],
  sortOrder: 10,
  active: true,
  officialUrl: "https://example.com",
  partnershipVerified: false,
  verificationDocumentUrl: "",
};

describe("validarea brandurilor", () => {
  it("acceptă un brand tehnic fără afirmație de parteneriat", () => {
    expect(brandFormSchema.safeParse(validBrand).success).toBe(true);
  });
  it("cere document justificativ pentru statutul de parteneriat verificat", () => {
    const result = brandFormSchema.safeParse({ ...validBrand, partnershipVerified: true });
    expect(result.success).toBe(false);
    if (!result.success)
      expect(result.error.flatten().fieldErrors.verificationDocumentUrl).toBeDefined();
  });
});
