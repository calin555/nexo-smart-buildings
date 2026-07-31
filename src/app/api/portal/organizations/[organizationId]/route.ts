import { NextRequest } from "next/server";

import { requireUser } from "@/lib/auth";
import { errorResponse } from "@/lib/errors";
import { assertOrganizationAccess } from "@/lib/rbac";

type RouteContext = { params: Promise<{ organizationId: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext): Promise<Response> {
  try {
    const user = await requireUser();
    const { organizationId } = await params;
    assertOrganizationAccess(user.memberships, organizationId);
    return Response.json({ organizationId });
  } catch (error) {
    return errorResponse(error);
  }
}
