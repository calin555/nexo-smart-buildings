import { AppError, errorResponse } from "@/lib/errors";
import { writeAuditLog } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireProjectAccess } from "@/modules/configurator/access";
import { updateRoomSchema } from "@/modules/configurator/schema";

async function requireRoom(projectId: string, organizationId: string, roomId: string) {
  const room = await prisma.projectRoom.findFirst({
    where: { id: roomId, projectId, organizationId },
    include: {
      geometries: { orderBy: { version: "desc" }, take: 1 },
      documentPage: { select: { documentId: true } },
    },
  });
  if (!room) throw new AppError("Camera nu există.", 404, "ROOM_NOT_FOUND");
  return room;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; roomId: string }> },
): Promise<Response> {
  try {
    const user = await requireUser();
    const { projectId, roomId } = await params;
    const project = await requireProjectAccess(user, projectId);
    const existing = await requireRoom(project.id, project.organizationId, roomId);
    const data = updateRoomSchema.parse(await request.json());
    const nextGeometryVersion = (existing.geometries[0]?.version ?? 0) + 1;

    const room = await prisma.$transaction(async (transaction) => {
      await transaction.roomFeature.deleteMany({ where: { roomId: existing.id } });
      const updated = await transaction.projectRoom.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          roomType: data.roomType,
          area: data.area,
          level: data.level,
          notes: data.notes,
          detectionStatus: data.detectionStatus,
          isConfirmed: data.isConfirmed,
          geometries: {
            create: {
              geometryType: "POLYGON",
              normalizedPoints: data.polygon,
              version: nextGeometryVersion,
            },
          },
          features: {
            create: data.features
              .filter((feature) => feature.enabled)
              .map((feature) => ({
                category: feature.category,
                featureCode: feature.featureCode,
                enabled: true,
                quantity: feature.quantity,
              })),
          },
        },
        include: { geometries: { orderBy: { version: "desc" }, take: 1 }, features: true },
      });
      return updated;
    });

    if (data.isConfirmed && room.source === "AI") {
      const [totalDetected, remaining] = await Promise.all([
        prisma.projectRoom.count({
          where: {
            source: "AI",
            documentPage: { documentId: existing.documentPage.documentId },
          },
        }),
        prisma.projectRoom.count({
          where: {
            source: "AI",
            isConfirmed: false,
            documentPage: { documentId: existing.documentPage.documentId },
          },
        }),
      ]);
      if (totalDetected > 0 && remaining === 0) {
        await prisma.$transaction([
          prisma.projectDocument.update({
            where: { id: existing.documentPage.documentId },
            data: { processingStatus: "COMPLETED" },
          }),
          prisma.planAnalysis.updateMany({
            where: { documentId: existing.documentPage.documentId, status: "NEEDS_REVIEW" },
            data: { status: "COMPLETED" },
          }),
          prisma.analysisJob.updateMany({
            where: { documentId: existing.documentPage.documentId, status: "NEEDS_REVIEW" },
            data: { status: "COMPLETED" },
          }),
        ]);
      }
    }

    await writeAuditLog({
      actorId: user.id,
      action: data.isConfirmed ? "PROJECT_ROOM_CONFIRMED" : "PROJECT_ROOM_UPDATED",
      entityType: "ProjectRoom",
      entityId: room.id,
      metadata: { projectId: project.id, organizationId: project.organizationId },
    });

    return Response.json({
      room: {
        id: room.id,
        documentPageId: room.documentPageId,
        name: room.name,
        roomType: room.roomType,
        area: room.area === null ? null : Number(room.area),
        level: room.level,
        notes: room.notes,
        confidence: room.confidence,
        detectionStatus: room.detectionStatus,
        source: room.source,
        isConfirmed: room.isConfirmed,
        polygon: room.geometries[0]?.normalizedPoints ?? [],
        features: room.features.map((feature) => ({
          category: feature.category,
          featureCode: feature.featureCode,
          enabled: feature.enabled,
          quantity: feature.quantity,
        })),
      },
    });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; roomId: string }> },
): Promise<Response> {
  try {
    const user = await requireUser();
    const { projectId, roomId } = await params;
    const project = await requireProjectAccess(user, projectId);
    const room = await requireRoom(project.id, project.organizationId, roomId);
    await prisma.projectRoom.delete({ where: { id: room.id } });
    await writeAuditLog({
      actorId: user.id,
      action: "PROJECT_ROOM_DELETED",
      entityType: "ProjectRoom",
      entityId: room.id,
      metadata: { projectId: project.id, organizationId: project.organizationId },
    });
    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
