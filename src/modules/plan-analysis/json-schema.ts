const point = {
  type: "object",
  additionalProperties: false,
  required: ["x", "y"],
  properties: {
    x: { type: "number", minimum: 0, maximum: 1 },
    y: { type: "number", minimum: 0, maximum: 1 },
  },
} as const;

export const planAnalysisJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["pages"],
  properties: {
    pages: {
      type: "array",
      minItems: 1,
      maxItems: 100,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "page",
          "imageWidth",
          "imageHeight",
          "rooms",
          "labels",
          "openings",
          "dimensions",
          "walls",
        ],
        properties: {
          page: { type: "integer", minimum: 1, maximum: 100 },
          imageWidth: { type: "integer", minimum: 1, maximum: 30000 },
          imageHeight: { type: "integer", minimum: 1, maximum: 30000 },
          rooms: {
            type: "array",
            maxItems: 300,
            items: {
              type: "object",
              additionalProperties: false,
              required: [
                "temporaryId",
                "detectedName",
                "detectedArea",
                "roomType",
                "confidence",
                "polygon",
              ],
              properties: {
                temporaryId: { type: "string" },
                detectedName: { type: ["string", "null"] },
                detectedArea: { type: ["number", "null"], minimum: 0 },
                roomType: {
                  type: "string",
                  enum: [
                    "LIVING",
                    "BEDROOM",
                    "KITCHEN",
                    "BATHROOM",
                    "HALL",
                    "DRESSING",
                    "OFFICE",
                    "TECHNICAL_ROOM",
                    "GARAGE",
                    "TERRACE",
                    "BALCONY",
                    "COMMERCIAL_SPACE",
                    "HOTEL_ROOM",
                    "OTHER",
                  ],
                },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                polygon: { type: "array", minItems: 3, maxItems: 64, items: point },
              },
            },
          },
          labels: {
            type: "array",
            maxItems: 1000,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["text", "confidence", "position"],
              properties: {
                text: { type: "string" },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                position: point,
              },
            },
          },
          openings: {
            type: "array",
            maxItems: 1000,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["type", "confidence", "points"],
              properties: {
                type: { type: "string", enum: ["DOOR", "WINDOW"] },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                points: { type: "array", minItems: 2, maxItems: 16, items: point },
              },
            },
          },
          dimensions: {
            type: "array",
            maxItems: 1000,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["value", "unit", "confidence"],
              properties: {
                value: { type: "number", exclusiveMinimum: 0 },
                unit: { type: "string" },
                confidence: { type: "number", minimum: 0, maximum: 1 },
              },
            },
          },
          walls: {
            type: "array",
            maxItems: 2000,
            items: {
              type: "object",
              additionalProperties: false,
              required: ["type", "confidence", "points"],
              properties: {
                type: { type: "string", enum: ["EXTERIOR", "INTERIOR", "UNKNOWN"] },
                confidence: { type: "number", minimum: 0, maximum: 1 },
                points: { type: "array", minItems: 2, maxItems: 128, items: point },
              },
            },
          },
        },
      },
    },
  },
} as const;
