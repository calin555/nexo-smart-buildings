import { OrganizationType } from "@prisma/client";
import { describe, expect, it } from "vitest";

import {
  getClientAccess,
  onboardingSchema,
  personalOrganizationName,
  resolvePostAuthDestination,
  safeAuthNext,
} from "@/modules/auth/onboarding";

describe("Google OAuth și onboarding", () => {
  it("validează câmpurile onboardingului", () => {
    const parsed = onboardingSchema.parse({
      name: "Ana Popescu",
      phone: "+40 721 234 567",
      clientType: "HOSPITALITY",
    });

    expect(parsed.clientType).toBe("HOSPITALITY");
    expect(() =>
      onboardingSchema.parse({ name: "A", phone: "invalid", clientType: "ADMIN" }),
    ).toThrow();
  });

  it("alege rolul și organizația exclusiv server-side", () => {
    expect(getClientAccess("INDIVIDUAL")).toEqual({
      organizationType: OrganizationType.INDIVIDUAL,
      roleCode: "INDIVIDUAL_CLIENT",
      organizationLabel: "profil personal",
    });
    expect(getClientAccess("DEVELOPER").roleCode).toBe("DEVELOPER");
    expect(getClientAccess("DESIGNER").roleCode).toBe("DESIGNER");
    expect(getClientAccess("INSTALLER").roleCode).toBe("INSTALLER");
  });

  it("trimite utilizatorul nou la onboarding și utilizatorul existent în portal", () => {
    expect(
      resolvePostAuthDestination({
        requestedNext: "/portal",
        profileStatus: "ACTIVE",
        membershipCount: 0,
      }),
    ).toBe("/onboarding");
    expect(
      resolvePostAuthDestination({
        requestedNext: "/portal",
        profileStatus: "ACTIVE",
        membershipCount: 1,
      }),
    ).toBe("/portal");
    expect(
      resolvePostAuthDestination({
        requestedNext: "/portal",
        profileStatus: "SUSPENDED",
        membershipCount: 1,
      }),
    ).toBe("/login?error=access");
  });

  it("respinge redirecturile externe și generează un nume stabil de organizație", () => {
    expect(safeAuthNext("https://example.com")).toBe("/portal");
    expect(safeAuthNext("//example.com")).toBe("/portal");
    expect(safeAuthNext("/\\example.com")).toBe("/portal");
    expect(safeAuthNext("/login")).toBe("/login");
    expect(personalOrganizationName("Ana Popescu", "COMPANY", "12345678-abcd")).toBe(
      "Ana Popescu · companie · 12345678",
    );
  });
});
