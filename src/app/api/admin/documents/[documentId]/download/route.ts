import { NextResponse } from "next/server";

import { writeAuditLog } from "@/lib/audit";
import { getCurrentUser } from "@/lib/auth";
import { AppError, errorResponse, ForbiddenError, UnauthorizedError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";
import { adminRoles } from "@/lib/rbac";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ documentId: string }> },
): Promise<Response> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new UnauthorizedError();
    if (!user.memberships.some(({ role }) => adminRoles.has(role))) {
      throw new ForbiddenError("Nu ai permisiunea de a accesa acest document.");
    }
    const { documentId } = await params;
    const document = await prisma.projectDocument.findUnique({ where: { id: documentId } });
    if (!document) throw new AppError("Documentul nu există.", 404, "DOCUMENT_NOT_FOUND");
    const storage = createAdminSupabaseClient();
    const { data, error } = await storage.storage
      .from("project-documents")
      .createSignedUrl(document.storagePath, 60);
    if (error || !data?.signedUrl)
      throw new AppError("Documentul nu poate fi deschis.", 502, "DOCUMENT_URL_FAILED");
    await writeAuditLog({
      actorId: user.id,
      action: "ADMIN_PROJECT_DOCUMENT_OPENED",
      entityType: "ProjectDocument",
      entityId: document.id,
      metadata: { organizationId: document.organizationId, projectId: document.projectId },
    });
    return NextResponse.redirect(new URL(data.signedUrl, request.url));
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
