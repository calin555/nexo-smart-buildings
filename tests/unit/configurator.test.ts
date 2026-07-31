import { describe, expect, it } from "vitest";

import { sanitizePlanFileName } from "@/modules/configurator/files";
import {
  applyRoomPreset,
  estimateRoomFeatureQuantities,
  roomPresets,
} from "@/modules/configurator/presets";
import { buildProductRecommendations } from "@/modules/configurator/recommendations";
import {
  createManualRoomSchema,
  normalizedPolygonSchema,
  projectDocumentMetadataSchema,
  updateRoomSchema,
} from "@/modules/configurator/schema";
import { calculateConfiguratorSummary } from "@/modules/configurator/summary";
import { confidenceLabel } from "@/modules/plan-analysis/confidence";
import { hasValidPlanSignature } from "@/modules/plan-analysis/file-signature";
import { providerAnalysisResultSchema } from "@/modules/plan-analysis/result-schema";

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

describe("presets, quantities and product recommendations", () => {
  it("definește toate cele opt preseturi cu funcții valide și cantități pozitive", () => {
    expect(roomPresets).toHaveLength(8);
    for (const preset of roomPresets) {
      const features = applyRoomPreset(preset.id);
      expect(features.length).toBeGreaterThan(0);
      expect(features.every((feature) => feature.enabled && feature.quantity > 0)).toBe(true);
    }
  });

  it("aplică presetul Comfort și estimează prudent cantitățile după suprafață", () => {
    const comfort = applyRoomPreset("COMFORT");
    expect(comfort.find((feature) => feature.featureCode === "LIGHTING_DIMMABLE")?.quantity).toBe(
      2,
    );
    const estimated = estimateRoomFeatureQuantities(comfort, 48);
    expect(estimated.find((feature) => feature.featureCode === "LIGHTING_ON_OFF")?.quantity).toBe(
      4,
    );
    expect(
      estimated.find((feature) => feature.featureCode === "HEATING_THERMOSTAT")?.quantity,
    ).toBe(1);
  });

  it("agregă cerințele pe camere și recomandă numai produsele din categoria relevantă", () => {
    const recommendations = buildProductRecommendations(
      [
        {
          features: [
            { category: "LIGHTING", featureCode: "LIGHTING_DIMMABLE", enabled: true, quantity: 2 },
            { category: "SHADING", featureCode: "SHADING_BLINDS", enabled: true, quantity: 1 },
          ],
        },
        {
          features: [
            { category: "LIGHTING", featureCode: "LIGHTING_DIMMABLE", enabled: true, quantity: 3 },
            { category: "ENERGY", featureCode: "ENERGY_MONITOR", enabled: false, quantity: 4 },
          ],
        },
      ],
      [
        {
          id: "lighting-product",
          name: "Actuator iluminat",
          brand: "Test",
          category: "Iluminat inteligent",
          badge: null,
          imageUrl: null,
          sortOrder: 20,
        },
        {
          id: "unrelated-product",
          name: "Cameră video",
          brand: "Test",
          category: "Sisteme de securitate",
          badge: null,
          imageUrl: null,
          sortOrder: 10,
        },
      ],
    );
    const lighting = recommendations.find((group) => group.category === "Iluminat inteligent");
    expect(lighting?.totalQuantity).toBe(5);
    expect(lighting?.requirements[0]?.roomCount).toBe(2);
    expect(lighting?.products.map((product) => product.id)).toEqual(["lighting-product"]);
    expect(recommendations.some((group) => group.category === "Accesorii & senzori")).toBe(false);
  });
});

describe("plan analysis", () => {
  it("clasifică scorurile de încredere la pragurile aprobate", () => {
    expect(confidenceLabel(0.86)).toBe("Detectat cu încredere ridicată");
    expect(confidenceLabel(0.85)).toBe("Verificare recomandată");
    expect(confidenceLabel(0.6)).toBe("Verificare recomandată");
    expect(confidenceLabel(0.59)).toBe("Necesită corectare");
  });

  it("verifică semnătura reală pentru PDF, PNG și JPEG", () => {
    expect(hasValidPlanSignature(new TextEncoder().encode("%PDF-1.7"), "application/pdf")).toBe(
      true,
    );
    expect(
      hasValidPlanSignature(
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        "image/png",
      ),
    ).toBe(true);
    expect(hasValidPlanSignature(new Uint8Array([0xff, 0xd8, 0xff]), "image/jpeg")).toBe(true);
    expect(hasValidPlanSignature(new TextEncoder().encode("not-pdf"), "application/pdf")).toBe(
      false,
    );
  });

  it("respinge detecții cu coordonate sau tipuri de cameră invalide", () => {
    const invalid = providerAnalysisResultSchema.safeParse({
      pages: [
        {
          page: 1,
          imageWidth: 1000,
          imageHeight: 700,
          rooms: [
            {
              temporaryId: "room-1",
              detectedName: "Living",
              detectedArea: 24,
              roomType: "UNKNOWN_ROOM",
              confidence: 0.9,
              polygon: [
                { x: -0.1, y: 0.1 },
                { x: 0.5, y: 0.1 },
                { x: 0.5, y: 0.5 },
              ],
            },
          ],
          labels: [],
          openings: [],
          dimensions: [],
          walls: [],
        },
      ],
    });
    expect(invalid.success).toBe(false);
  });
});
