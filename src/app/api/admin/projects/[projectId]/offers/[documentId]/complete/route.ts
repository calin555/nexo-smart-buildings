import { writeAuditLog } from "@/lib/audit";
import { getCurrentUser } from "@/lib/auth";
import { AppError, errorResponse, ForbiddenError, UnauthorizedError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { adminRoles } from "@/lib/rbac";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; documentId: string }> },
): Promise<Response> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();
    if (!user.memberships.some(({ role }) => adminRoles.has(role))) {
      throw new ForbiddenError("Nu ai permisiunea de a publica oferte.");
    }
    const { projectId, documentId } = await params;
    const document = await prisma.projectDocument.findFirst({
      where: { id: documentId, projectId, documentType: "OTHER" },
    });
    if (!document) throw new AppError("Oferta nu există.", 404, "OFFER_NOT_FOUND");

    const storage = createAdminSupabaseClient();
    const { error: storageError } = await storage.storage
      .from("project-documents")
      .createSignedUrl(document.storagePath, 60);
    if (storageError) throw new AppError("Fișierul ofertei lipsește.", 422, "OFFER_INCOMPLETE");

    await prisma.projectDocument.update({
      where: { id: document.id },
      data: { processingStatus: "UPLOADED" },
    });
    await writeAuditLog({
      actorId: user.id,
      action: "PROJECT_OFFER_PUBLISHED",
      entityType: "ProjectDocument",
      entityId: document.id,
      metadata: { organizationId: document.organizationId, projectId: document.projectId },
    });
    return Response.json({ published: true });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
