import { describe, expect, it } from "vitest";

import { sanitizePlanFileName } from "@/modules/configurator/files";
import {
  createManualRoomSchema,
  normalizedPolygonSchema,
  projectDocumentMetadataSchema,
  updateRoomSchema,
} from "@/modules/configurator/schema";
import { calculateConfiguratorSummary } from "@/modules/configurator/summary";

const polygon = [
  { x: 0.1, y: 0.1 },
  { x: 0.7, y: 0.1 },
  { x: 0.7, y: 0.8 },
  { x: 0.1, y: 0.8 },
];

describe("configurator geometry", () => {
  it("acceptă și păstrează coordonate normalizate", () => {
    expect(normalizedPolygonSchema.parse(polygon)).toEqual(polygon);
  });

  it("respinge coordonatele în pixeli sau poligoanele incomplete", () => {
    expect(normalizedPolygonSchema.safeParse([{ x: 120, y: 80 }]).success).toBe(false);
    expect(
      normalizedPolygonSchema.safeParse([
        { x: 0.1, y: 0.1 },
        { x: 0.8, y: 0.8 },
      ]).success,
    ).toBe(false);
  });

  it("validează fallback-ul de cameră desenată manual", () => {
    const result = createManualRoomSchema.parse({
      documentPageId: "00000000-0000-4000-8000-000000000001",
      name: "Living",
      roomType: "LIVING",
      polygon,
    });
    expect(result.roomType).toBe("LIVING");
  });
});

describe("configurator document security", () => {
  it("acceptă numai PDF, JPG și PNG de maximum 15 MB", () => {
    expect(
      projectDocumentMetadataSchema.safeParse({
        fileName: "plan.pdf",
        mimeType: "application/pdf",
        fileSize: 2_000_000,
      }).success,
    ).toBe(true);
    expect(
      projectDocumentMetadataSchema.safeParse({
        fileName: "plan.svg",
        mimeType: "image/svg+xml",
        fileSize: 1000,
      }).success,
    ).toBe(false);
    expect(
      projectDocumentMetadataSchema.safeParse({
        fileName: "plan.png",
        mimeType: "image/png",
        fileSize: 15_000_001,
      }).success,
    ).toBe(false);
  });

  it("sanitizează numele fișierului înainte de stocare", () => {
    expect(sanitizePlanFileName("Plan parter (final) ă.png")).toBe("Plan-parter-final-a.png");
  });
});

describe("room features and live summary", () => {
  it("validează editarea camerei și funcțiile smart", () => {
    const result = updateRoomSchema.parse({
      name: "Living",
      roomType: "LIVING",
      area: 29.4,
      level: "Parter",
      notes: null,
      detectionStatus: "MANUAL",
      isConfirmed: true,
      polygon,
      features: [
        { category: "LIGHTING", featureCode: "LIGHTING_DIMMABLE", enabled: true, quantity: 3 },
      ],
    });
    expect(result.features[0]?.quantity).toBe(3);
  });

  it("actualizează cantitățile agregate pentru camere", () => {
    const summary = calculateConfiguratorSummary([
      {
        detectionStatus: "MANUAL",
        isConfirmed: true,
        confidence: null,
        features: [
          { category: "LIGHTING", featureCode: "LIGHTING_ON_OFF", enabled: true, quantity: 2 },
          { category: "LIGHTING", featureCode: "LIGHTING_DIMMABLE", enabled: true, quantity: 3 },
          { category: "SHADING", featureCode: "SHADING_BLINDS", enabled: true, quantity: 2 },
          { category: "ENERGY", featureCode: "ENERGY_SWITCHED_SOCKET", enabled: true, quantity: 4 },
        ],
      },
    ]);
    expect(summary.roomsConfirmed).toBe(1);
    expect(summary.lightingCircuits).toBe(5);
    expect(summary.dimmableCircuits).toBe(3);
    expect(summary.blinds).toBe(2);
    expect(summary.switchedSockets).toBe(4);
  });
});
