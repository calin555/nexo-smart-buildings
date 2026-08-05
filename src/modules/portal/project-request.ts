import { z } from "zod";

export const projectRequestSchema = z.object({
  organizationId: z.string().uuid(),
  buildingType: z.enum(["CASA", "APARTAMENT", "BLOC", "PENSIUNE_HOTEL", "ALTA_CLADIRE"]),
  kit: z.enum([
    "FARA_KIT",
    "SMART_START",
    "APARTAMENT_SMART",
    "CASA_COMFORT",
    "CASA_PREMIUM_KNX",
    "SECURITATE",
    "ENERGIE",
    "BLOC_SMART",
    "PENSIUNE_SMART",
    "HOTEL_SMART",
  ]),
  functions: z
    .array(
      z.enum([
        "ILUMINAT",
        "PRIZE",
        "JALUZELE",
        "INCALZIRE",
        "CLIMATIZARE",
        "SECURITATE",
        "ENERGIE",
        "MULTIMEDIA",
      ]),
    )
    .max(8),
  notes: z.string().trim().max(1000),
});

export type ProjectRequest = z.infer<typeof projectRequestSchema>;

export function serializeProjectRequest(request: Omit<ProjectRequest, "organizationId">): string {
  return JSON.stringify({ version: 1, ...request });
}

export function parseProjectRequest(
  value: string | null,
): Omit<ProjectRequest, "organizationId"> | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    const result = projectRequestSchema.omit({ organizationId: true }).safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export const buildingLabels: Record<ProjectRequest["buildingType"], string> = {
  CASA: "Casă",
  APARTAMENT: "Apartament",
  BLOC: "Bloc rezidențial",
  PENSIUNE_HOTEL: "Pensiune / hotel",
  ALTA_CLADIRE: "Alt tip de clădire",
};

export const kitLabels: Record<ProjectRequest["kit"], string> = {
  FARA_KIT: "Fără kit prestabilit",
  SMART_START: "Kit Smart Start",
  APARTAMENT_SMART: "Kit Apartament Smart",
  CASA_COMFORT: "Kit Casă Comfort",
  CASA_PREMIUM_KNX: "Kit Casă Premium KNX",
  SECURITATE: "Kit Securitate",
  ENERGIE: "Kit Energie",
  BLOC_SMART: "Kit Bloc Smart",
  PENSIUNE_SMART: "Kit Pensiune Smart",
  HOTEL_SMART: "Kit Hotel Smart",
};

export const functionLabels: Record<ProjectRequest["functions"][number], string> = {
  ILUMINAT: "Iluminat",
  PRIZE: "Prize și circuite comandate",
  JALUZELE: "Jaluzele",
  INCALZIRE: "Încălzire",
  CLIMATIZARE: "Climatizare",
  SECURITATE: "Securitate",
  ENERGIE: "Monitorizare energie",
  MULTIMEDIA: "Multimedia",
};
