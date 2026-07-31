import { describe, expect, it } from "vitest";

import { assertOrganizationAccess, hasRole } from "@/lib/rbac";

describe("RBAC", () => {
  it("permite unui administrator accesul în zona administrativă", () => {
    expect(hasRole("ADMIN", ["ADMIN", "SUPER_ADMIN"])).toBe(true);
  });

  it("interzice unui client accesul în zona administrativă", () => {
    expect(hasRole("INDIVIDUAL_CLIENT", ["ADMIN", "SUPER_ADMIN"])).toBe(false);
  });

  it("izolează organizațiile între membership-uri", () => {
    const memberships = [{ organizationId: "org-client-a" }];
    expect(() => assertOrganizationAccess(memberships, "org-client-a")).not.toThrow();
    expect(() => assertOrganizationAccess(memberships, "org-client-b")).toThrow();
  });
});
