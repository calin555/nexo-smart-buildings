import { errorResponse } from "@/lib/errors";
import { writeAuditLog } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { requireProjectAccess } from "@/modules/configurator/access";
import { sanitizePlanFileName } from "@/modules/configurator/files";
import { projectDocumentMetadataSchema } from "@/modules/configurator/schema";

const extensions = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
} as const;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
): Promise<Response> {
  try {
    const user = await requireUser();
    enforceRateLimit(`plan-upload:${user.id}`, 10, 60_000);
    const { projectId } = await params;
    const project = await requireProjectAccess(user, projectId);
    const body: unknown = await request.json();
    const metadata = projectDocumentMetadataSchema.parse(body);
    const documentId = crypto.randomUUID();
    const storagePath = `${project.organizationId}/${project.id}/${documentId}/source.${extensions[metadata.mimeType]}`;

    const document = await prisma.projectDocument.create({
      data: {
        id: documentId,
        projectId: project.id,
        organizationId: project.organizationId,
        uploadedById: user.id,
        storagePath,
        fileName: sanitizePlanFileName(metadata.fileName),
        mimeType: metadata.mimeType,
        fileSize: metadata.fileSize,
        documentType: "PLAN",
        processingStatus: "QUEUED",
      },
    });

    await writeAuditLog({
      actorId: user.id,
      action: "PROJECT_PLAN_UPLOAD_RESERVED",
      entityType: "ProjectDocument",
      entityId: document.id,
      metadata: { organizationId: project.organizationId, mimeType: metadata.mimeType },
    });

    return Response.json(
      { documentId: document.id, storagePath: document.storagePath },
      { status: 201 },
    );
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
