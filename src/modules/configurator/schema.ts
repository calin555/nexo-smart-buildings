import { RoomDetectionStatus, RoomFeatureCategory, RoomType } from "@prisma/client";
import { z } from "zod";

export const normalizedPointSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export const normalizedPolygonSchema = z.array(normalizedPointSchema).min(3).max(64);

export const createProjectSchema = z.object({
  name: z.string().trim().min(3).max(120),
  organizationId: z.string().uuid(),
});

export const projectDocumentMetadataSchema = z.object({
  fileName: z.string().trim().min(1).max(180),
  mimeType: z.enum(["application/pdf", "image/jpeg", "image/png"]),
  fileSize: z.number().int().positive().max(15_000_000),
});

export const documentPageRegistrationSchema = z.object({
  pageCount: z.number().int().min(1).max(100),
  width: z.number().int().positive().max(20_000).nullable(),
  height: z.number().int().positive().max(20_000).nullable(),
});

export const createManualRoomSchema = z.object({
  documentPageId: z.string().uuid(),
  name: z.string().trim().min(1).max(100).default("Cameră nouă"),
  roomType: z.nativeEnum(RoomType).default(RoomType.OTHER),
  polygon: normalizedPolygonSchema,
});

export const roomFeatureInputSchema = z.object({
  category: z.nativeEnum(RoomFeatureCategory),
  featureCode: z.string().trim().min(2).max(80),
  enabled: z.boolean(),
  quantity: z.number().int().min(0).max(999),
});

export const updateRoomSchema = z.object({
  name: z.string().trim().min(1).max(100),
  roomType: z.nativeEnum(RoomType),
  area: z.number().min(0).max(100_000).nullable(),
  level: z.string().trim().max(50).nullable(),
  notes: z.string().trim().max(1000).nullable(),
  detectionStatus: z.nativeEnum(RoomDetectionStatus),
  isConfirmed: z.boolean(),
  polygon: normalizedPolygonSchema,
  features: z.array(roomFeatureInputSchema).max(100),
});

export type NormalizedPoint = z.infer<typeof normalizedPointSchema>;
export type RoomFeatureInput = z.infer<typeof roomFeatureInputSchema>;
