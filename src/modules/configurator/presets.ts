import type { RoomType } from "@prisma/client";

import { featureDefinitions } from "@/modules/configurator/constants";
import type { RoomFeatureInput } from "@/modules/configurator/schema";

export type RoomPresetId =
  | "BASIC_SMART"
  | "COMFORT"
  | "PREMIUM"
  | "KNX_PROFESSIONAL"
  | "HOTEL_ROOM"
  | "OFFICE"
  | "ENERGY_SAVER"
  | "SECURITY_PLUS";

type PresetFeature = { code: string; quantity: number };

export type RoomPreset = {
  id: RoomPresetId;
  name: string;
  description: string;
  features: readonly PresetFeature[];
};

export const roomPresets: readonly RoomPreset[] = [
  {
    id: "BASIC_SMART",
    name: "Basic Smart",
    description: "Control esențial pentru iluminat și prize, potrivit unei renovări simple.",
    features: [
      { code: "LIGHTING_ON_OFF", quantity: 2 },
      { code: "LIGHTING_SCENES", quantity: 1 },
      { code: "ENERGY_SWITCHED_SOCKET", quantity: 2 },
    ],
  },
  {
    id: "COMFORT",
    name: "Comfort",
    description: "Lumină, umbrire și temperatură coordonate pentru confort zilnic.",
    features: [
      { code: "LIGHTING_ON_OFF", quantity: 2 },
      { code: "LIGHTING_DIMMABLE", quantity: 2 },
      { code: "LIGHTING_SCENES", quantity: 1 },
      { code: "SHADING_BLINDS", quantity: 2 },
      { code: "HEATING_THERMOSTAT", quantity: 1 },
      { code: "SECURITY_WINDOW", quantity: 2 },
    ],
  },
  {
    id: "PREMIUM",
    name: "Premium",
    description: "Automatizare completă, senzori de ambient, securitate și multimedia.",
    features: [
      { code: "LIGHTING_ON_OFF", quantity: 3 },
      { code: "LIGHTING_DIMMABLE", quantity: 3 },
      { code: "LIGHTING_RGBW", quantity: 1 },
      { code: "LIGHTING_SCENES", quantity: 1 },
      { code: "LIGHTING_PRESENCE", quantity: 1 },
      { code: "SHADING_CURTAINS", quantity: 2 },
      { code: "HEATING_THERMOSTAT", quantity: 1 },
      { code: "SENSOR_CO2", quantity: 1 },
      { code: "SECURITY_WINDOW", quantity: 2 },
      { code: "MEDIA_MULTIROOM", quantity: 1 },
      { code: "ENERGY_MONITOR", quantity: 1 },
    ],
  },
  {
    id: "KNX_PROFESSIONAL",
    name: "KNX Professional",
    description: "Cerințe extinse pentru o infrastructură cablată și scalabilă KNX.",
    features: [
      { code: "LIGHTING_ON_OFF", quantity: 4 },
      { code: "LIGHTING_DIMMABLE", quantity: 4 },
      { code: "LIGHTING_SCENES", quantity: 1 },
      { code: "LIGHTING_PRESENCE", quantity: 1 },
      { code: "LIGHTING_LUX", quantity: 1 },
      { code: "SHADING_BLINDS", quantity: 2 },
      { code: "SHADING_AUTO", quantity: 1 },
      { code: "HEATING_THERMOSTAT", quantity: 1 },
      { code: "HEATING_FLOOR", quantity: 1 },
      { code: "HEATING_ZONE", quantity: 1 },
      { code: "ENERGY_METER", quantity: 4 },
    ],
  },
  {
    id: "HOTEL_ROOM",
    name: "Hotel Room",
    description: "Confort, economie și acces controlat pentru o cameră de hotel.",
    features: [
      { code: "LIGHTING_ON_OFF", quantity: 3 },
      { code: "LIGHTING_DIMMABLE", quantity: 2 },
      { code: "LIGHTING_SCENES", quantity: 1 },
      { code: "SHADING_CURTAINS", quantity: 1 },
      { code: "HEATING_THERMOSTAT", quantity: 1 },
      { code: "SECURITY_WINDOW", quantity: 1 },
      { code: "ACCESS_CONTROL", quantity: 1 },
      { code: "ACCESS_RFID", quantity: 1 },
      { code: "ENERGY_MONITOR", quantity: 1 },
    ],
  },
  {
    id: "OFFICE",
    name: "Office",
    description: "Iluminat eficient, aer sănătos și acces pentru spații de lucru.",
    features: [
      { code: "LIGHTING_ON_OFF", quantity: 4 },
      { code: "LIGHTING_DIMMABLE", quantity: 4 },
      { code: "LIGHTING_PRESENCE", quantity: 2 },
      { code: "LIGHTING_LUX", quantity: 2 },
      { code: "SHADING_BLINDS", quantity: 2 },
      { code: "HEATING_ZONE", quantity: 1 },
      { code: "COOLING_FAN_COIL", quantity: 1 },
      { code: "SENSOR_CO2", quantity: 1 },
      { code: "ACCESS_CONTROL", quantity: 1 },
    ],
  },
  {
    id: "ENERGY_SAVER",
    name: "Energy Saver",
    description: "Control bazat pe prezență și măsurare pentru reducerea consumului.",
    features: [
      { code: "LIGHTING_ON_OFF", quantity: 2 },
      { code: "LIGHTING_PRESENCE", quantity: 1 },
      { code: "LIGHTING_LUX", quantity: 1 },
      { code: "HEATING_THERMOSTAT", quantity: 1 },
      { code: "ENERGY_MONITOR", quantity: 1 },
      { code: "ENERGY_SWITCHED_SOCKET", quantity: 3 },
      { code: "ENERGY_METER", quantity: 3 },
    ],
  },
  {
    id: "SECURITY_PLUS",
    name: "Security Plus",
    description: "Detecție, supraveghere și control al accesului pentru zone sensibile.",
    features: [
      { code: "SECURITY_MOTION", quantity: 2 },
      { code: "SECURITY_DOOR", quantity: 1 },
      { code: "SECURITY_WINDOW", quantity: 2 },
      { code: "SECURITY_SMOKE", quantity: 1 },
      { code: "SECURITY_GAS", quantity: 1 },
      { code: "SECURITY_WATER", quantity: 2 },
      { code: "SECURITY_CAMERA", quantity: 2 },
      { code: "SECURITY_ALARM", quantity: 1 },
      { code: "ACCESS_LOCK", quantity: 1 },
    ],
  },
] as const;

export function getRoomPreset(id: RoomPresetId): RoomPreset {
  const preset = roomPresets.find((item) => item.id === id);
  if (!preset) throw new Error("PRESET_NOT_FOUND");
  return preset;
}

export function applyRoomPreset(id: RoomPresetId): RoomFeatureInput[] {
  return getRoomPreset(id).features.map((presetFeature) => {
    const definition = featureDefinitions.find((item) => item.code === presetFeature.code);
    if (!definition) throw new Error(`UNKNOWN_PRESET_FEATURE:${presetFeature.code}`);
    return {
      category: definition.category,
      featureCode: definition.code,
      enabled: true,
      quantity: presetFeature.quantity,
    };
  });
}

export function recommendedPresetForRoom(roomType: RoomType): RoomPresetId {
  if (roomType === "HOTEL_ROOM") return "HOTEL_ROOM";
  if (roomType === "OFFICE" || roomType === "COMMERCIAL_SPACE") return "OFFICE";
  if (roomType === "GARAGE" || roomType === "TECHNICAL_ROOM") return "SECURITY_PLUS";
  if (roomType === "BEDROOM") return "COMFORT";
  return "BASIC_SMART";
}

const areaBasedDivisors: Readonly<Record<string, number>> = {
  LIGHTING_ON_OFF: 12,
  LIGHTING_DIMMABLE: 15,
  LIGHTING_FIXTURES: 5,
  LIGHTING_ZONES: 20,
  LIGHTING_PRESENCE: 35,
  LIGHTING_LUX: 35,
  SECURITY_MOTION: 40,
  SECURITY_CAMERA: 50,
  ENERGY_SWITCHED_SOCKET: 7,
};

export function estimateRoomFeatureQuantities(
  features: readonly RoomFeatureInput[],
  area: number | null,
): RoomFeatureInput[] {
  if (!area || area <= 0) return [...features];
  return features.map((feature) => {
    const divisor = areaBasedDivisors[feature.featureCode];
    if (!feature.enabled || !divisor) return { ...feature };
    return { ...feature, quantity: Math.max(feature.quantity, Math.ceil(area / divisor)) };
  });
}
