import { AppError, errorResponse } from "@/lib/errors";
import { writeAuditLog } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireProjectAccess } from "@/modules/configurator/access";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; documentId: string }> },
): Promise<Response> {
  try {
    const user = await requireUser();
    const { projectId, documentId } = await params;
    const project = await requireProjectAccess(user, projectId);
    const document = await prisma.projectDocument.findFirst({
      where: { id: documentId, projectId: project.id, organizationId: project.organizationId },
    });
    if (!document) throw new AppError("Documentul nu există.", 404, "DOCUMENT_NOT_FOUND");

    const supabase = await createServerSupabaseClient();
    const { error: signedUrlError } = await supabase.storage
      .from("project-documents")
      .createSignedUrl(document.storagePath, 60);
    if (signedUrlError) {
      await prisma.projectDocument.update({
        where: { id: document.id },
        data: { processingStatus: "FAILED" },
      });
      throw new AppError("Fișierul nu a fost găsit în storage.", 422, "UPLOAD_INCOMPLETE");
    }

    const [, page] = await prisma.$transaction([
      prisma.projectDocument.update({
        where: { id: document.id },
        data: { processingStatus: "UPLOADED" },
      }),
      prisma.projectDocumentPage.upsert({
        where: { documentId_pageNumber: { documentId: document.id, pageNumber: 1 } },
        update: { previewStoragePath: document.storagePath },
        create: {
          documentId: document.id,
          pageNumber: 1,
          previewStoragePath: document.storagePath,
        },
      }),
    ]);

    await writeAuditLog({
      actorId: user.id,
      action: "PROJECT_PLAN_UPLOADED",
      entityType: "ProjectDocument",
      entityId: document.id,
      metadata: { organizationId: project.organizationId, fileSize: document.fileSize },
    });
    return Response.json({ documentId: document.id, pageId: page.id });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
