import { errorResponse, ForbiddenError } from "@/lib/errors";
import { writeAuditLog } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { adminRoles } from "@/lib/rbac";
import {
  calculateCommercialSummary,
  kitDefinitions,
} from "@/modules/commercial-configurator/config";
import {
  kitQuoteInputSchema,
  quoteScaleForKit,
  serializeKitQuoteRequest,
  validateKitQuoteOptions,
} from "@/modules/commercial-configurator/quote-request";

export async function POST(request: Request): Promise<Response> {
  try {
    const user = await requireUser();
    enforceRateLimit(`kit-quote:${user.id}`, 6, 60_000);
    const input = kitQuoteInputSchema.parse((await request.json()) as unknown);
    validateKitQuoteOptions(input);

    const membership = user.memberships.find(({ role }) => !adminRoles.has(role));
    if (!membership) {
      throw new ForbiddenError("Cererea trebuie trimisă dintr-un cont de client.");
    }

    const buildingScale = quoteScaleForKit(input.kitId, input.buildingScale);
    const normalizedInput = { ...input, buildingScale };
    const summary = calculateCommercialSummary(
      input.kitId,
      new Set(input.selectedOptionIds),
      buildingScale,
    );
    const kit = kitDefinitions[input.kitId];
    const project = await prisma.project.create({
      data: {
        organizationId: membership.organizationId,
        createdById: user.id,
        name: `Cerere ofertă · ${kit.name}`,
        description: serializeKitQuoteRequest(normalizedInput, summary),
      },
    });

    await writeAuditLog({
      actorId: user.id,
      action: "KIT_QUOTE_REQUEST_CREATED",
      entityType: "Project",
      entityId: project.id,
      metadata: {
        organizationId: project.organizationId,
        kitId: input.kitId,
        estimatedPrice: summary.price,
        selectedOptions: input.selectedOptionIds.length,
      },
    });

    return Response.json({ projectId: project.id, redirectTo: "/portal?request=sent" }, { status: 201 });
  } catch (error: unknown) {
    return errorResponse(error);
  }
}
