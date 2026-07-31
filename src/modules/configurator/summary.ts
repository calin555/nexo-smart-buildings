import type { RoomDetectionStatus } from "@prisma/client";

import type { RoomFeatureInput } from "@/modules/configurator/schema";

export type ConfiguratorSummary = {
  roomsDetected: number;
  roomsConfirmed: number;
  roomsNeedCorrection: number;
  lightingCircuits: number;
  dimmableCircuits: number;
  blinds: number;
  thermostats: number;
  sensors: number;
  cameras: number;
  detectors: number;
  hvacZones: number;
  switchedSockets: number;
};

type SummaryRoom = {
  detectionStatus: RoomDetectionStatus;
  isConfirmed: boolean;
  confidence: number | null;
  features: RoomFeatureInput[];
};

function quantity(features: RoomFeatureInput[], codes: readonly string[]): number {
  return features
    .filter((feature) => feature.enabled && codes.includes(feature.featureCode))
    .reduce((total, feature) => total + feature.quantity, 0);
}

export function calculateConfiguratorSummary(rooms: readonly SummaryRoom[]): ConfiguratorSummary {
  const features = rooms.flatMap((room) => room.features);
  return {
    roomsDetected: rooms.length,
    roomsConfirmed: rooms.filter((room) => room.isConfirmed).length,
    roomsNeedCorrection: rooms.filter(
      (room) =>
        !room.isConfirmed &&
        (room.detectionStatus === "DETECTED" ||
          (room.confidence !== null && room.confidence < 0.6)),
    ).length,
    lightingCircuits: quantity(features, ["LIGHTING_ON_OFF", "LIGHTING_DIMMABLE"]),
    dimmableCircuits: quantity(features, ["LIGHTING_DIMMABLE"]),
    blinds: quantity(features, ["SHADING_BLINDS", "SHADING_ROLLERS", "SHADING_CURTAINS"]),
    thermostats: quantity(features, ["HEATING_THERMOSTAT"]),
    sensors: quantity(features, [
      "LIGHTING_PRESENCE",
      "LIGHTING_LUX",
      "SENSOR_CO2",
      "SENSOR_HUMIDITY",
      "SECURITY_MOTION",
      "SECURITY_DOOR",
      "SECURITY_WINDOW",
    ]),
    cameras: quantity(features, ["SECURITY_CAMERA"]),
    detectors: quantity(features, ["SECURITY_SMOKE", "SECURITY_GAS", "SECURITY_WATER"]),
    hvacZones: quantity(features, [
      "HEATING_ZONE",
      "HEATING_FLOOR",
      "COOLING_AC",
      "COOLING_FAN_COIL",
    ]),
    switchedSockets: quantity(features, ["ENERGY_SWITCHED_SOCKET"]),
  };
}
