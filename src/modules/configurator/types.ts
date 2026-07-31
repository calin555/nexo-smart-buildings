import type { RoomDetectionStatus, RoomFeatureCategory, RoomType } from "@prisma/client";

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
  isConfirmed: boolean;
  polygon: NormalizedPoint[];
  features: EditorFeature[];
};

export type EditorPage = {
  id: string;
  pageNumber: number;
};
