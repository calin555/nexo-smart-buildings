import { describe, expect, it } from "vitest";

import { calculateCommercialSummary, kitDefinitions } from "@/modules/commercial-configurator/config";
import {
  parseKitQuoteRequest,
  serializeKitQuoteRequest,
  validateKitQuoteOptions,
} from "@/modules/commercial-configurator/quote-request";

describe("cererea de ofertă din configurator", () => {
  it("salvează configurația și estimarea recalculată pe server", () => {
    const input = {
      kitId: "securitate" as const,
      selectedOptionIds: [...kitDefinitions.securitate.defaultSelections],
    };
    const summary = calculateCommercialSummary(
      input.kitId,
      new Set(input.selectedOptionIds),
    );
    const stored = parseKitQuoteRequest(serializeKitQuoteRequest(input, summary));

    expect(stored).not.toBeNull();
    expect(stored?.type).toBe("KIT_QUOTE_REQUEST");
    expect(stored?.kitId).toBe("securitate");
    expect(stored?.estimatedPrice).toBe(summary.price);
    expect(stored?.equipment).toEqual(summary.equipment);
  });

  it("respinge opțiunile inventate de client", () => {
    expect(() =>
      validateKitQuoteOptions({
        kitId: "securitate",
        selectedOptionIds: ["security-alarm", "bypass-price"],
      }),
    ).toThrow();
  });
});
