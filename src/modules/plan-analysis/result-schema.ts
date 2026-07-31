import { RoomType } from "@prisma/client";
import { z } from "zod";

import { normalizedPointSchema, normalizedPolygonSchema } from "@/modules/configurator/schema";

export const detectedRoomSchema = z.object({
  temporaryId: z.string().trim().min(1).max(100),
  detectedName: z.string().trim().min(1).max(100).nullable(),
  detectedArea: z.number().min(0).max(100_000).nullable(),
  roomType: z.nativeEnum(RoomType),
  confidence: z.number().min(0).max(1),
  polygon: normalizedPolygonSchema,
});

export const providerPageResultSchema = z.object({
  page: z.number().int().min(1).max(100),
  imageWidth: z.number().int().positive().max(30_000),
  imageHeight: z.number().int().positive().max(30_000),
  rooms: z.array(detectedRoomSchema).max(300),
  labels: z
    .array(
      z.object({
        text: z.string().trim().min(1).max(200),
        confidence: z.number().min(0).max(1),
        position: normalizedPointSchema,
      }),
    )
    .max(1000),
  openings: z
    .array(
      z.object({
        type: z.enum(["DOOR", "WINDOW"]),
        confidence: z.number().min(0).max(1),
        points: z.array(normalizedPointSchema).min(2).max(16),
      }),
    )
    .max(1000),
  dimensions: z
    .array(
      z.object({
        value: z.number().positive().max(1_000_000),
        unit: z.string().trim().min(1).max(20),
        confidence: z.number().min(0).max(1),
      }),
    )
    .max(1000),
  walls: z
    .array(
      z.object({
        type: z.enum(["EXTERIOR", "INTERIOR", "UNKNOWN"]),
        confidence: z.number().min(0).max(1),
        points: z.array(normalizedPointSchema).min(2).max(128),
      }),
    )
    .max(2000),
});

export const providerAnalysisResultSchema = z.object({
  pages: z.array(providerPageResultSchema).min(1).max(100),
});

export type ProviderAnalysisResult = z.infer<typeof providerAnalysisResultSchema>;
