import type {
  AnalysisJobStatus,
  RoomDetectionStatus,
  RoomFeatureCategory,
  RoomSource,
  RoomType,
} from "@prisma/client";

import type { NormalizedPoint } from "@/modules/configurator/schema";

export type EditorFeature = {
  category: RoomFeatureCategory;
  featureCode: string;
  enabled: boolean;
  quantity: number;
};

export type EditorRoom = {
  id: string;
  documentPageId: string;
  name: string;
  roomType: RoomType;
  area: number | null;
  level: string | null;
  notes: string | null;
  confidence: number | null;
  detectionStatus: RoomDetectionStatus;
  source: RoomSource;
  isConfirmed: boolean;
  polygon: NormalizedPoint[];
  features: EditorFeature[];
};

export type EditorAnalysisState = {
  configured: boolean;
  jobId: string | null;
  status: AnalysisJobStatus | null;
  progress: number;
  roomsDetected: number;
  errorCode: string | null;
  errorMessage: string | null;
  issueCount: number;
};

export type EditorPage = {
  id: string;
  pageNumber: number;
};

export type EditorRecommendationProduct = {
  id: string;
  name: string;
  brand: string;
  category: string;
  badge: string | null;
  imageUrl: string | null;
  sortOrder: number;
};
