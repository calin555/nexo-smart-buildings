import { z } from "zod";

import { writeAuditLog } from "@/lib/audit";
import { getCurrentUser } from "@/lib/auth";
import { AppError, errorResponse, ForbiddenError, UnauthorizedError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { adminRoles } from "@/lib/rbac";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { sanitizePlanFileName } from "@/modules/configurator/files";

const metadataSchema = z.object({
  fileName: z.string().trim().min(1).max(180),
  mimeType: z.literal("application/pdf"),
  fileSize: z.number().int().positive().max(15_000_000),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
): Promise<Response> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();
    if (!user.memberships.some(({ role }) => adminRoles.has(role))) {
      throw new ForbiddenError("Nu ai permisiunea de a publica oferte.");
    }
    enforceRateLimit(`admin-offer:${user.id}`, 10, 60_000);
    const { projectId } = await params;
    const metadata = metadataSchema.parse((await request.json()) as unknown);
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new AppError("Proiectul nu există.", 404, "PROJECT_NOT_FOUND");

    const documentId = crypto.randomUUID();
    const storagePath = `${project.organizationId}/${project.id}/${documentId}/offer.pdf`;
    const storage = createAdminSupabaseClient();
    const { data: signedUpload, error: signedUploadError } = await storage.storage
      .from("project-documents")
      .createSignedUploadUrl(storagePath);
    if (signedUploadError || !signedUpload?.token) {
      throw new AppError("Oferta nu a putut fi pregătită.", 502, "OFFER_UPLOAD_FAILED");
    }

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
        documentType: "OTHER",
        processingStatus: "QUEUED",
      },
    });
    await writeAuditLog({
      actorId: user.id,
      action: "PROJECT_OFFER_UPLOAD_RESERVED",
      entityType: "ProjectDocument",
      entityId: document.id,
      metadata: { organizationId: project.organizationId, projectId: project.id },
    });
    return Response.json({ documentId, storagePath, token: signedUpload.token }, { status: 201 });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
