import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { enforceRateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { createRouteSupabaseClient } from "@/lib/supabase/route";
import {
  getClientAccess,
  onboardingSchema,
  personalOrganizationName,
} from "@/modules/auth/onboarding";

function onboardingError(request: NextRequest, code: string): NextResponse {
  return NextResponse.redirect(new URL(`/onboarding?error=${code}`, request.url), 303);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { supabase, applyCookies } = createRouteSupabaseClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return applyCookies(NextResponse.redirect(new URL("/login", request.url), 303));
  }

  try {
    enforceRateLimit(`onboarding:${user.id}`, 5, 60_000);
    const formData = await request.formData();
    const input = onboardingSchema.parse({
      name: formData.get("name"),
      phone: formData.get("phone"),
      clientType: formData.get("clientType"),
    });
    const access = getClientAccess(input.clientType);

    await prisma.$transaction(async (tx) => {
      await tx.profile.upsert({
        where: { id: user.id },
        update: { name: input.name, email: user.email! },
        create: {
          id: user.id,
          email: user.email!,
          name: input.name,
          status: "ACTIVE",
        },
      });

      const existingMembership = await tx.membership.findFirst({
        where: { profileId: user.id },
        select: { id: true },
      });
      if (existingMembership) return;

      const organization = await tx.organization.create({
        data: {
          type: access.organizationType,
          legalName: personalOrganizationName(input.name, input.clientType, user.id),
          billingData: {
            phone: input.phone,
            clientType: input.clientType,
            onboardingSource: "GOOGLE_OR_SELF_SERVICE",
          } satisfies Prisma.InputJsonValue,
        },
      });

      await tx.membership.create({
        data: {
          profileId: user.id,
          organizationId: organization.id,
          roleCode: access.roleCode,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "AUTH_ONBOARDING_COMPLETED",
          entityType: "Organization",
          entityId: organization.id,
          metadata: { clientType: input.clientType },
        },
      });
    });

    return applyCookies(NextResponse.redirect(new URL("/portal", request.url), 303));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const membership = await prisma.membership.findFirst({ where: { profileId: user.id } });
      if (membership) {
        return applyCookies(NextResponse.redirect(new URL("/portal", request.url), 303));
      }
    }
    return applyCookies(onboardingError(request, "invalid"));
  }
}
