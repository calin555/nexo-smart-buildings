import { AppError, errorResponse } from "@/lib/errors";
import { writeAuditLog } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { requireProjectAccess } from "@/modules/configurator/access";
import { createManualRoomSchema } from "@/modules/configurator/schema";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
): Promise<Response> {
  try {
    const user = await requireUser();
    enforceRateLimit(`manual-room:${user.id}`, 30, 60_000);
    const { projectId } = await params;
    const project = await requireProjectAccess(user, projectId);
    const data = createManualRoomSchema.parse(await request.json());
    const page = await prisma.projectDocumentPage.findFirst({
      where: {
        id: data.documentPageId,
        document: { projectId: project.id, organizationId: project.organizationId },
      },
    });
    if (!page) throw new AppError("Pagina planului nu există.", 404, "PAGE_NOT_FOUND");

    const room = await prisma.projectRoom.create({
      data: {
        projectId: project.id,
        documentPageId: page.id,
        organizationId: project.organizationId,
        createdById: user.id,
        name: data.name,
        roomType: data.roomType,
        detectionStatus: "MANUAL",
        source: "MANUAL",
        isConfirmed: false,
        geometries: {
          create: { geometryType: "POLYGON", normalizedPoints: data.polygon },
        },
      },
      include: { geometries: { orderBy: { version: "desc" }, take: 1 }, features: true },
    });

    await writeAuditLog({
      actorId: user.id,
      action: "PROJECT_ROOM_DRAWN",
      entityType: "ProjectRoom",
      entityId: room.id,
      metadata: { projectId: project.id, organizationId: project.organizationId },
    });

    return Response.json(
      {
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
          features: [],
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
