import "server-only";

import type {
  DetectedRoom,
  PlanAnalysisProvider,
  PlanDocumentInput,
  PlanPageAnalysis,
} from "@/modules/plan-analysis/provider";

/** Deterministic provider used only by live E2E tests; production selection rejects it. */
export class FixturePlanAnalysisProvider implements PlanAnalysisProvider {
  readonly providerName = "fixture";
  readonly modelVersion = "e2e-v1";

  async analyzeDocument(input: PlanDocumentInput): Promise<PlanPageAnalysis[]> {
    return [
      {
        documentId: input.documentId,
        page: 1,
        imageWidth: 1600,
        imageHeight: 1000,
        rooms: [
          {
            temporaryId: "fixture-living",
            detectedName: "Living detectat",
            detectedArea: 28.4,
            roomType: "LIVING",
            confidence: 0.92,
            polygon: [
              { x: 0.12, y: 0.16 },
              { x: 0.46, y: 0.16 },
              { x: 0.46, y: 0.55 },
              { x: 0.12, y: 0.55 },
            ],
          },
        ],
        labels: [{ text: "LIVING 28.4 mp", confidence: 0.94, position: { x: 0.29, y: 0.35 } }],
        openings: [
          {
            type: "WINDOW",
            confidence: 0.88,
            points: [
              { x: 0.2, y: 0.16 },
              { x: 0.32, y: 0.16 },
            ],
          },
        ],
        dimensions: [{ value: 28.4, unit: "m²", confidence: 0.9 }],
        walls: [],
      },
    ];
  }

  async detectRooms(input: PlanDocumentInput): Promise<DetectedRoom[]> {
    return (await this.analyzeDocument(input))[0]?.rooms ?? [];
  }

  async detectLabels(input: PlanDocumentInput): Promise<PlanPageAnalysis["labels"]> {
    return (await this.analyzeDocument(input))[0]?.labels ?? [];
  }

  async detectDimensions(
    input: PlanDocumentInput,
  ): Promise<Array<{ value: number; unit: string; confidence: number }>> {
    return (await this.analyzeDocument(input))[0]?.dimensions ?? [];
  }

  async detectOpenings(input: PlanDocumentInput): Promise<PlanPageAnalysis["openings"]> {
    return (await this.analyzeDocument(input))[0]?.openings ?? [];
  }

  calculateConfidence(result: PlanPageAnalysis): number {
    return result.rooms[0]?.confidence ?? 0;
  }
}
