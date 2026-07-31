import { ForbiddenError } from "@/lib/errors";

export const roles = ["INDIVIDUAL_CLIENT", "COMPANY_CLIENT", "DEVELOPER", "DESIGNER", "INSTALLER", "SALES_AGENT", "ADMIN", "SUPER_ADMIN"] as const;
export type RoleCode = (typeof roles)[number];
export const adminRoles = new Set<RoleCode>(["ADMIN", "SUPER_ADMIN"]);
export function hasRole(role: RoleCode, allowed: readonly RoleCode[]): boolean { return allowed.includes(role); }
export function assertOrganizationAccess(memberships: readonly { organizationId: string }[], organizationId: string): void { if (!memberships.some((m) => m.organizationId === organizationId)) throw new ForbiddenError("Nu puteți accesa datele altei organizații."); }
