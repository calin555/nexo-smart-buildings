import { featureDefinitions } from "@/modules/configurator/constants";
import type { RoomFeatureInput } from "@/modules/configurator/schema";

export type RecommendationRoom = { features: readonly RoomFeatureInput[] };

export type RecommendationProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  badge: string | null;
  imageUrl: string | null;
  sortOrder: number;
};

export type RecommendationRequirement = {
  featureCode: string;
  label: string;
  quantity: number;
  roomCount: number;
};

export type ProductRecommendationGroup = {
  category: string;
  totalQuantity: number;
  requirements: RecommendationRequirement[];
  products: RecommendationProduct[];
};

const categoryByFeaturePrefix: ReadonlyArray<[string, string]> = [
  ["LIGHTING_", "Iluminat inteligent"],
  ["SHADING_", "Întrerupătoare & umbrire"],
  ["HEATING_", "Confortul casei"],
  ["COOLING_", "Confortul casei"],
  ["VENTILATION_", "Confortul casei"],
  ["SENSOR_", "Accesorii & senzori"],
  ["SECURITY_", "Sisteme de securitate"],
  ["ACCESS_", "Sisteme de securitate"],
  ["MEDIA_", "Sisteme multimedia"],
  ["ENERGY_SWITCHED_SOCKET", "Prize / relee smart"],
  ["ENERGY_", "Accesorii & senzori"],
];

export function productCategoryForFeature(featureCode: string): string | null {
  return categoryByFeaturePrefix.find(([prefix]) => featureCode.startsWith(prefix))?.[1] ?? null;
}

export function buildProductRecommendations(
  rooms: readonly RecommendationRoom[],
  products: readonly RecommendationProduct[],
): ProductRecommendationGroup[] {
  const requirements = new Map<
    string,
    Map<string, { quantity: number; roomIndexes: Set<number> }>
  >();

  rooms.forEach((room, roomIndex) => {
    room.features.forEach((feature) => {
      if (!feature.enabled || feature.quantity <= 0) return;
      const category = productCategoryForFeature(feature.featureCode);
      if (!category) return;
      const categoryRequirements = requirements.get(category) ?? new Map();
      const current = categoryRequirements.get(feature.featureCode) ?? {
        quantity: 0,
        roomIndexes: new Set<number>(),
      };
      current.quantity += feature.quantity;
      current.roomIndexes.add(roomIndex);
      categoryRequirements.set(feature.featureCode, current);
      requirements.set(category, categoryRequirements);
    });
  });

  return [...requirements.entries()]
    .map(([category, categoryRequirements]) => {
      const items = [...categoryRequirements.entries()]
        .map(([featureCode, value]) => ({
          featureCode,
          label:
            featureDefinitions.find((definition) => definition.code === featureCode)?.label ??
            featureCode,
          quantity: value.quantity,
          roomCount: value.roomIndexes.size,
        }))
        .sort((left, right) => left.label.localeCompare(right.label, "ro"));
      return {
        category,
        totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
        requirements: items,
        products: products
          .filter((product) => product.category === category)
          .sort(
            (left, right) =>
              left.sortOrder - right.sortOrder || left.name.localeCompare(right.name),
          )
          .slice(0, 3),
      };
    })
    .sort((left, right) => left.category.localeCompare(right.category, "ro"));
}
