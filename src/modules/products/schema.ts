import { z } from "zod";

export const productIllustrations = ["KIT", "BLINDS", "CLIMATE", "LOCK", "ENERGY", "CUSTOM"] as const;

export const productFormSchema = z.object({
  name: z.string().trim().min(3, "Numele trebuie să aibă minimum 3 caractere.").max(140),
  brand: z.string().trim().min(2, "Completează brandul.").max(80),
  category: z.string().trim().min(2, "Completează categoria.").max(100),
  description: z.string().trim().max(500).optional().default(""),
  priceLei: z.coerce.number().finite().min(0, "Prețul nu poate fi negativ.").max(10_000_000),
  badge: z.string().trim().max(24).optional().default(""),
  imageUrl: z.union([z.literal(""), z.string().trim().url("Introdu un URL valid pentru imagine.")]).default(""),
  illustration: z.enum(productIllustrations),
  sortOrder: z.coerce.number().int().min(0).max(100_000),
  active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
