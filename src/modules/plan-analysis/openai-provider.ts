import "server-only";

import { z } from "zod";

import { planAnalysisJsonSchema } from "@/modules/plan-analysis/json-schema";
import type {
  DetectedRoom,
  PlanAnalysisProvider,
  PlanDocumentInput,
  PlanPageAnalysis,
} from "@/modules/plan-analysis/provider";
import {
  providerAnalysisResultSchema,
  type ProviderAnalysisResult,
} from "@/modules/plan-analysis/result-schema";

const openAIResponseSchema = z.object({
  output: z.array(
    z.object({
      type: z.string(),
      content: z
        .array(
          z.object({
            type: z.string(),
            text: z.string().optional(),
          }),
        )
        .optional(),
    }),
  ),
});

const analysisPrompt = `Analyze this architectural floor plan. Detect rooms, room labels, written areas,
doors, windows, dimensions, and visible wall lines. Return coordinates normalized to the full page
from 0 to 1. Use the closest allowed roomType. Never invent a room or measurement: use null or an
empty array when evidence is insufficient. Keep polygons inside the page, non-self-intersecting, and
ordered around each room boundary. Every detected item needs an evidence-based confidence from 0 to 1.`;

export class PlanAnalysisProviderError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "PlanAnalysisProviderError";
  }
}

function outputText(payload: z.infer<typeof openAIResponseSchema>): string {
  for (const item of payload.output) {
    if (item.type !== "message") continue;
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && content.text) return content.text;
    }
  }
  throw new PlanAnalysisProviderError(
    "Furnizorul nu a returnat un rezultat structurat.",
    "EMPTY_PROVIDER_RESULT",
  );
}

export class OpenAIPlanAnalysisProvider implements PlanAnalysisProvider {
  readonly providerName = "openai";
  readonly modelVersion: string;
  private cached: Promise<PlanPageAnalysis[]> | null = null;

  constructor(
    private readonly apiKey: string,
    model: string,
  ) {
    this.modelVersion = model;
  }

  async analyzeDocument(input: PlanDocumentInput): Promise<PlanPageAnalysis[]> {
    if (!this.cached) this.cached = this.requestAnalysis(input);
    return this.cached;
  }

  async detectRooms(input: PlanDocumentInput): Promise<DetectedRoom[]> {
    return (await this.analyzeDocument(input)).flatMap((page) => page.rooms);
  }

  async detectLabels(input: PlanDocumentInput): Promise<PlanPageAnalysis["labels"]> {
    return (await this.analyzeDocument(input)).flatMap((page) => page.labels);
  }

  async detectDimensions(
    input: PlanDocumentInput,
  ): Promise<Array<{ value: number; unit: string; confidence: number }>> {
    return (await this.analyzeDocument(input)).flatMap((page) => page.dimensions);
  }

  async detectOpenings(input: PlanDocumentInput): Promise<PlanPageAnalysis["openings"]> {
    return (await this.analyzeDocument(input)).flatMap((page) => page.openings);
  }

  calculateConfidence(result: PlanPageAnalysis): number {
    if (result.rooms.length === 0) return 0;
    return result.rooms.reduce((sum, room) => sum + room.confidence, 0) / result.rooms.length;
  }

  private async requestAnalysis(input: PlanDocumentInput): Promise<PlanPageAnalysis[]> {
    const planInput =
      input.mimeType === "application/pdf"
        ? { type: "input_file", file_url: input.signedUrl, detail: "high" }
        : { type: "input_image", image_url: input.signedUrl, detail: "original" };

    let response: Response;
    try {
      response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        signal: AbortSignal.timeout(55_000),
        headers: {
          authorization: `Bearer ${this.apiKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: this.modelVersion,
          store: false,
          safety_identifier: `n3xo-plan-${input.documentId}`,
          reasoning: { effort: "low" },
          max_output_tokens: 12_000,
          input: [
            {
              role: "user",
              content: [{ type: "input_text", text: analysisPrompt }, planInput],
            },
          ],
          text: {
            format: {
              type: "json_schema",
              name: "plan_analysis",
              strict: true,
              schema: planAnalysisJsonSchema,
            },
          },
        }),
      });
    } catch (error: unknown) {
      const code =
        error instanceof DOMException && error.name === "TimeoutError" ? "TIMEOUT" : "NETWORK";
      throw new PlanAnalysisProviderError(
        code === "TIMEOUT"
          ? "Analiza a depășit timpul disponibil. Poți relua jobul."
          : "Furnizorul de analiză nu este disponibil momentan.",
        code,
      );
    }

    if (!response.ok) {
      throw new PlanAnalysisProviderError(
        `Furnizorul de analiză a răspuns cu status ${response.status}.`,
        response.status === 429 ? "RATE_LIMITED" : "PROVIDER_ERROR",
      );
    }

    const apiPayload = openAIResponseSchema.safeParse(await response.json());
    if (!apiPayload.success) {
      throw new PlanAnalysisProviderError(
        "Răspunsul furnizorului nu are formatul așteptat.",
        "INVALID_PROVIDER_RESPONSE",
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(outputText(apiPayload.data)) as unknown;
    } catch (error: unknown) {
      if (error instanceof PlanAnalysisProviderError) throw error;
      throw new PlanAnalysisProviderError(
        "Rezultatul furnizorului nu este JSON valid.",
        "INVALID_PROVIDER_JSON",
      );
    }

    const result = providerAnalysisResultSchema.safeParse(parsedJson);
    if (!result.success) {
      throw new PlanAnalysisProviderError(
        "Detecțiile nu respectă schema de siguranță a aplicației.",
        "INVALID_ANALYSIS_RESULT",
      );
    }
    return this.attachDocument(input.documentId, result.data);
  }

  private attachDocument(documentId: string, result: ProviderAnalysisResult): PlanPageAnalysis[] {
    return result.pages.map((page) => ({ documentId, ...page }));
  }
}
