import { AppError, errorResponse } from "@/lib/errors";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requireProjectAccess } from "@/modules/configurator/access";
import { documentPageRegistrationSchema } from "@/modules/configurator/schema";

export async function POST(
  request: Request,
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
    const data = documentPageRegistrationSchema.parse(await request.json());

    await prisma.$transaction(
      Array.from({ length: data.pageCount }, (_, index) =>
        prisma.projectDocumentPage.upsert({
          where: {
            documentId_pageNumber: { documentId: document.id, pageNumber: index + 1 },
          },
          update: { width: data.width, height: data.height },
          create: {
            documentId: document.id,
            pageNumber: index + 1,
            previewStoragePath: document.storagePath,
            width: data.width,
            height: data.height,
          },
        }),
      ),
    );
    const pages = await prisma.projectDocumentPage.findMany({
      where: { documentId: document.id },
      orderBy: { pageNumber: "asc" },
      select: { id: true, pageNumber: true },
    });
    return Response.json({ pages });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
