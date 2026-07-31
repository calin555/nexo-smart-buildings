"use server";

import { redirect } from "next/navigation";

import { writeAuditLog } from "@/lib/audit";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertUserOrganization } from "@/modules/configurator/access";
import { createProjectSchema } from "@/modules/configurator/schema";

export async function createConfiguratorProject(formData: FormData): Promise<void> {
  const user = await requireUser();
  const parsed = createProjectSchema.safeParse({
    name: formData.get("name"),
    organizationId: formData.get("organizationId"),
  });
  if (!parsed.success) redirect("/portal/configurator?error=invalid-project");

  assertUserOrganization(user, parsed.data.organizationId);
  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      organizationId: parsed.data.organizationId,
      createdById: user.id,
    },
  });
  await writeAuditLog({
    actorId: user.id,
    action: "CONFIGURATOR_PROJECT_CREATED",
    entityType: "Project",
    entityId: project.id,
    metadata: { organizationId: project.organizationId },
  });
  redirect(`/portal/configurator/${project.id}`);
}
