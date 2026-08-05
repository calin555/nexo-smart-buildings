import { describe, expect, it } from "vitest";

import {
  parseProjectRequest,
  projectRequestSchema,
  serializeProjectRequest,
} from "@/modules/portal/project-request";

describe("portal project request", () => {
  it("validează și păstrează kitul, funcțiile și observațiile clientului", () => {
    const input = projectRequestSchema.parse({
      organizationId: "00000000-0000-4000-8000-000000000001",
      buildingType: "CASA",
      kit: "CASA_COMFORT",
      functions: ["ILUMINAT", "PRIZE", "JALUZELE"],
      notes: "Parter și etaj",
    });
    const stored = serializeProjectRequest({
      buildingType: input.buildingType,
      kit: input.kit,
      functions: input.functions,
      notes: input.notes,
    });
    expect(parseProjectRequest(stored)).toEqual({
      buildingType: "CASA",
      kit: "CASA_COMFORT",
      functions: ["ILUMINAT", "PRIZE", "JALUZELE"],
      notes: "Parter și etaj",
    });
  });

  it("respinge cerințele nevalide", () => {
    expect(parseProjectRequest("not-json")).toBeNull();
    expect(projectRequestSchema.safeParse({ organizationId: "bad" }).success).toBe(false);
  });
});
