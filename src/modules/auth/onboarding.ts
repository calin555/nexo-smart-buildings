import { OrganizationType } from "@prisma/client";
import { z } from "zod";

import type { RoleCode } from "@/lib/rbac";

export const onboardingClientTypes = [
  "INDIVIDUAL",
  "COMPANY",
  "DEVELOPER",
  "HOSPITALITY",
  "DESIGNER",
  "INSTALLER",
] as const;

export type OnboardingClientType = (typeof onboardingClientTypes)[number];

export const onboardingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(24)
    .regex(/^\+?[0-9\s().-]+$/, "Numărul de telefon nu este valid."),
  clientType: z.enum(onboardingClientTypes),
});

export const onboardingClientTypeOptions: ReadonlyArray<{
  value: OnboardingClientType;
  label: string;
}> = [
  { value: "INDIVIDUAL", label: "Persoană fizică" },
  { value: "COMPANY", label: "Companie" },
  { value: "DEVELOPER", label: "Dezvoltator" },
  { value: "HOSPITALITY", label: "Pensiune / hotel" },
  { value: "DESIGNER", label: "Proiectant" },
  { value: "INSTALLER", label: "Instalator" },
];

type ClientAccess = Readonly<{
  organizationType: OrganizationType;
  roleCode: RoleCode;
  organizationLabel: string;
}>;

const clientAccessMap: Record<OnboardingClientType, ClientAccess> = {
  INDIVIDUAL: {
    organizationType: OrganizationType.INDIVIDUAL,
    roleCode: "INDIVIDUAL_CLIENT",
    organizationLabel: "profil personal",
  },
  COMPANY: {
    organizationType: OrganizationType.COMPANY,
    roleCode: "COMPANY_CLIENT",
    organizationLabel: "companie",
  },
  DEVELOPER: {
    organizationType: OrganizationType.DEVELOPER,
    roleCode: "DEVELOPER",
    organizationLabel: "dezvoltator",
  },
  HOSPITALITY: {
    organizationType: OrganizationType.COMPANY,
    roleCode: "COMPANY_CLIENT",
    organizationLabel: "ospitalitate",
  },
  DESIGNER: {
    organizationType: OrganizationType.COMPANY,
    roleCode: "DESIGNER",
    organizationLabel: "proiectare",
  },
  INSTALLER: {
    organizationType: OrganizationType.COMPANY,
    roleCode: "INSTALLER",
    organizationLabel: "instalare",
  },
};

export function getClientAccess(clientType: OnboardingClientType): ClientAccess {
  return clientAccessMap[clientType];
}

export function safeAuthNext(next: string | null): string {
  return next?.startsWith("/") && !next.startsWith("//") && !next.includes("\\")
    ? next
    : "/portal";
}

export function resolvePostAuthDestination(
  input: Readonly<{
    requestedNext: string;
    profileStatus?: "ACTIVE" | "INVITED" | "SUSPENDED";
    membershipCount: number;
  }>,
): string {
  if (input.requestedNext !== "/portal") return input.requestedNext;
  if (input.profileStatus === "SUSPENDED") return "/login?error=access";
  return input.membershipCount > 0 ? "/portal" : "/onboarding";
}

export function personalOrganizationName(
  name: string,
  clientType: OnboardingClientType,
  userId: string,
): string {
  const access = getClientAccess(clientType);
  return `${name.trim()} · ${access.organizationLabel} · ${userId.slice(0, 8)}`;
}
