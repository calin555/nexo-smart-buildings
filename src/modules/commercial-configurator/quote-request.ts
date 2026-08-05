import { z } from "zod";

import {
  commercialOptions,
  kitIds,
  type BuildingScale,
  type CommercialSummary,
  type KitId,
} from "@/modules/commercial-configurator/config";

const blockScaleSchema = z.object({
  kind: z.literal("block"),
  staircases: z.number().int().min(1).max(20),
  studios: z.number().int().min(0).max(500),
  twoRoom: z.number().int().min(0).max(500),
  threeRoom: z.number().int().min(0).max(500),
  fourPlusRoom: z.number().int().min(0).max(500),
  parking: z.boolean(),
  basement: z.boolean(),
  exterior: z.boolean(),
});

const hospitalityScaleSchema = z.object({
  kind: z.literal("hospitality"),
  standardRooms: z.number().int().min(0).max(500),
  suites: z.number().int().min(0).max(500),
  accessibleRooms: z.number().int().min(0).max(500),
  reception: z.boolean(),
  restaurant: z.boolean(),
  spa: z.boolean(),
});

export const buildingScaleSchema = z.discriminatedUnion("kind", [
  blockScaleSchema,
  hospitalityScaleSchema,
]);

export const kitQuoteInputSchema = z.object({
  kitId: z.enum(kitIds),
  selectedOptionIds: z.array(z.string().trim().min(1).max(80)).max(40),
  buildingScale: buildingScaleSchema.optional(),
});

const equipmentSchema = z.object({
  label: z.string(),
  quantity: z.number().int().nonnegative(),
});

const storedKitQuoteSchema = kitQuoteInputSchema.extend({
  version: z.literal(2),
  type: z.literal("KIT_QUOTE_REQUEST"),
  estimatedPrice: z.number().nonnegative(),
  products: z.number().int().nonnegative(),
  devices: z.number().int().nonnegative(),
  equipment: z.array(equipmentSchema),
});

export type KitQuoteInput = z.infer<typeof kitQuoteInputSchema>;
export type StoredKitQuote = z.infer<typeof storedKitQuoteSchema>;

const validOptionIds = new Set(commercialOptions.map(({ id }) => id));

export function validateKitQuoteOptions(input: KitQuoteInput): void {
  if (input.selectedOptionIds.some((optionId) => !validOptionIds.has(optionId))) {
    throw new z.ZodError([
      {
        code: "custom",
        path: ["selectedOptionIds"],
        message: "Configurația conține o opțiune necunoscută.",
      },
    ]);
  }
}

export function serializeKitQuoteRequest(
  input: KitQuoteInput,
  summary: CommercialSummary,
): string {
  return JSON.stringify({
    version: 2,
    type: "KIT_QUOTE_REQUEST",
    ...input,
    estimatedPrice: summary.price,
    products: summary.products,
    devices: summary.devices,
    equipment: summary.equipment,
  } satisfies StoredKitQuote);
}

export function parseKitQuoteRequest(value: string | null): StoredKitQuote | null {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    const result = storedKitQuoteSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function selectedQuoteOptions(request: StoredKitQuote) {
  const selectedIds = new Set(request.selectedOptionIds);
  return commercialOptions.filter(({ id }) => selectedIds.has(id));
}

export function quoteScaleForKit(
  kitId: KitId,
  buildingScale: BuildingScale | undefined,
): BuildingScale | undefined {
  if (kitId === "bloc-smart") return buildingScale?.kind === "block" ? buildingScale : undefined;
  if (kitId === "pensiune-smart" || kitId === "hotel-smart") {
    return buildingScale?.kind === "hospitality" ? buildingScale : undefined;
  }
  return undefined;
}
