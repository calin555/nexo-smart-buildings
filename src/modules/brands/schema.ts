import { z } from "zod";

import { kitIds } from "@/modules/commercial-configurator/config";

export const brandUsageCategories = [
  "Echipamente de tablou",
  "Butoane și aparataj",
  "Senzori",
  "Termostate",
  "Panouri",
  "Gateway-uri",
  "Management energetic",
] as const;
export const brandLevels = ["STANDARD", "PROFESSIONAL", "LUXURY"] as const;

export const brandFormSchema = z
  .object({
    name: z.string().trim().min(2, "Completează numele brandului.").max(100),
    slug: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Folosește litere mici, cifre și cratime."),
    logoUrl: z.union([z.literal(""), z.string().trim().url("Introdu un URL valid.")]).default(""),
    description: z
      .string()
      .trim()
      .min(20, "Descrierea trebuie să aibă minimum 20 de caractere.")
      .max(700),
    usageCategories: z
      .array(z.enum(brandUsageCategories))
      .min(1, "Selectează cel puțin o categorie."),
    level: z.enum(brandLevels),
    kitIds: z.array(z.enum(kitIds)).min(1, "Selectează cel puțin un kit."),
    sortOrder: z.coerce.number().int().min(0).max(100_000),
    active: z.boolean(),
    officialUrl: z
      .union([z.literal(""), z.string().trim().url("Introdu un URL oficial valid.")])
      .default(""),
    partnershipVerified: z.boolean(),
    verificationDocumentUrl: z
      .union([z.literal(""), z.string().trim().url("Introdu un URL valid pentru document.")])
      .default(""),
  })
  .superRefine((value, context) => {
    if (value.partnershipVerified && !value.verificationDocumentUrl)
      context.addIssue({
        code: "custom",
        path: ["verificationDocumentUrl"],
        message: "Documentul justificativ este obligatoriu pentru un statut verificat.",
      });
  });
