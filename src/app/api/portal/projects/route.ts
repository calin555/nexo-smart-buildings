import { errorResponse } from "@/lib/errors";
import { writeAuditLog } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { assertUserOrganization } from "@/modules/configurator/access";
import { projectRequestSchema, serializeProjectRequest } from "@/modules/portal/project-request";

export async function POST(request: Request): Promise<Response> {
  try {
    const user = await requireUser();
    enforceRateLimit(`portal-project:${user.id}`, 8, 60_000);
    const input = projectRequestSchema.parse((await request.json()) as unknown);
    assertUserOrganization(user, input.organizationId);
    const project = await prisma.project.create({
      data: {
        organizationId: input.organizationId,
        createdById: user.id,
        name: `Proiect ${new Intl.DateTimeFormat("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date())}`,
        description: serializeProjectRequest({
          buildingType: input.buildingType,
          kit: input.kit,
          functions: input.functions,
          notes: input.notes,
        }),
      },
    });
    await writeAuditLog({
      actorId: user.id,
      action: "PORTAL_PROJECT_CREATED",
      entityType: "Project",
      entityId: project.id,
      metadata: { organizationId: project.organizationId },
    });
    return Response.json({ projectId: project.id }, { status: 201 });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
