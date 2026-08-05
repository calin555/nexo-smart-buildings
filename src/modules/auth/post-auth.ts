import "server-only";

import { prisma } from "@/lib/prisma";
import { resolvePostAuthDestination } from "@/modules/auth/onboarding";

export async function destinationForAuthenticatedUser(
  userId: string,
  requestedNext: string,
): Promise<string> {
  const profile = await prisma.profile.findUnique({
    where: { id: userId },
    select: { status: true, _count: { select: { memberships: true } } },
  });

  return resolvePostAuthDestination({
    requestedNext,
    profileStatus: profile?.status,
    membershipCount: profile?._count.memberships ?? 0,
  });
}
