import "server-only";

import type { AuthenticatedUser } from "@/lib/auth";
import { ForbiddenError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

export function userOrganizationIds(user: AuthenticatedUser): string[] {
  return user.memberships.map(({ organizationId }) => organizationId);
}

export function assertUserOrganization(user: AuthenticatedUser, organizationId: string): void {
  if (!user.memberships.some((membership) => membership.organizationId === organizationId)) {
    throw new ForbiddenError("Nu poți accesa proiectele altei organizații.");
  }
}

export async function requireProjectAccess(user: AuthenticatedUser, projectId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId: { in: userOrganizationIds(user) },
    },
  });
  if (!project) {
    throw new ForbiddenError("Nu poți accesa acest proiect.");
  }
  return project;
}
