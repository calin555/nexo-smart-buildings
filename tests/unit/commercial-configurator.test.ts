import { describe, expect, it } from "vitest";

import {
  calculateBuildingScale,
  calculateCommercialSummary,
  kitDefinitions,
} from "../../src/modules/commercial-configurator/config";

describe("configuratorul comercial", () => {
  it("pornește Kit Comfort cu estimarea și cantitățile aprobate", () => {
    const summary = calculateCommercialSummary(
      "casa-comfort",
      new Set(kitDefinitions["casa-comfort"].defaultSelections),
    );

    expect(summary.price).toBe(3420);
    expect(summary.products).toBe(48);
    expect(summary.devices).toBe(62);
    expect(summary.savings).toBe(2080);
    expect(summary.equipment).toEqual(
      expect.arrayContaining([
        { label: "actuatoare iluminat", quantity: 2 },
        { label: "actuatoare jaluzele", quantity: 1 },
        { label: "surse KNX", quantity: 1 },
        { label: "gateway-uri IP", quantity: 1 },
        { label: "senzori temperatură", quantity: 9 },
        { label: "întrerupătoare", quantity: 12 },
        { label: "senzori prezență", quantity: 4 },
      ]),
    );
  });

  it("recalculează prețul, produsele și echipamentele când o opțiune este eliminată", () => {
    const selections = new Set(kitDefinitions["casa-comfort"].defaultSelections);
    selections.delete("light-dimming");
    const summary = calculateCommercialSummary("casa-comfort", selections);

    expect(summary.price).toBe(3330);
    expect(summary.products).toBe(45);
    expect(summary.devices).toBe(56);
    expect(summary.equipment).toContainEqual({ label: "actuatoare iluminat", quantity: 1 });
  });

  it("păstrează configurațiile implicite în intervalul comercial al fiecărui kit", () => {
    for (const kit of Object.values(kitDefinitions)) {
      const summary = calculateCommercialSummary(kit.id, new Set(kit.defaultSelections));
      expect(summary.price).toBeGreaterThanOrEqual(kit.minPrice);
      expect(summary.price).toBeLessThanOrEqual(kit.maxPrice);
    }
  });

  it("dimensionează blocul după scări și tipologiile apartamentelor", () => {
    const scale = calculateBuildingScale({
      kind: "block",
      staircases: 2,
      studios: 4,
      twoRoom: 8,
      threeRoom: 8,
      fourPlusRoom: 4,
      parking: true,
      basement: true,
      exterior: true,
    });

    expect(scale.units).toBe(24);
    expect(scale.spaces).toBe(60);
    expect(scale.price).toBe(12_640);
    expect(scale.equipment).toContainEqual({
      label: "posturi videointerfon apartament",
      quantity: 24,
    });
  });

  it("dimensionează camerele identice pentru o pensiune", () => {
    const scale = calculateBuildingScale({
      kind: "hospitality",
      standardRooms: 10,
      suites: 2,
      accessibleRooms: 1,
      reception: true,
      restaurant: false,
      spa: false,
    });

    expect(scale.units).toBe(13);
    expect(scale.spaces).toBe(14);
    expect(scale.equipment).toContainEqual({
      label: "controlere cameră hotel",
      quantity: 13,
    });
  });
});
