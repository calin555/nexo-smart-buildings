import type { RoomType } from "@prisma/client";

import type { NormalizedPoint } from "@/modules/configurator/schema";

export type PlanDocumentInput = {
  documentId: string;
  signedUrl: string;
  mimeType: string;
};

export type DetectedRoom = {
  temporaryId: string;
  detectedName: string | null;
  detectedArea: number | null;
  roomType: RoomType;
  confidence: number;
  polygon: NormalizedPoint[];
};

export type PlanPageAnalysis = {
  documentId: string;
  page: number;
  imageWidth: number;
  imageHeight: number;
  rooms: DetectedRoom[];
  labels: Array<{ text: string; confidence: number; position: NormalizedPoint }>;
  openings: Array<{ type: "DOOR" | "WINDOW"; confidence: number; points: NormalizedPoint[] }>;
  dimensions: Array<{ value: number; unit: string; confidence: number }>;
  walls: Array<{
    type: "EXTERIOR" | "INTERIOR" | "UNKNOWN";
    confidence: number;
    points: NormalizedPoint[];
  }>;
};

export interface PlanAnalysisProvider {
  readonly providerName: string;
  readonly modelVersion: string;
  analyzeDocument(input: PlanDocumentInput): Promise<PlanPageAnalysis[]>;
  detectRooms(input: PlanDocumentInput): Promise<DetectedRoom[]>;
  detectLabels(input: PlanDocumentInput): Promise<PlanPageAnalysis["labels"]>;
  detectDimensions(
    input: PlanDocumentInput,
  ): Promise<Array<{ value: number; unit: string; confidence: number }>>;
  detectOpenings(input: PlanDocumentInput): Promise<PlanPageAnalysis["openings"]>;
  calculateConfidence(result: PlanPageAnalysis): number;
}
