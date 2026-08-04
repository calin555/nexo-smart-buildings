import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createRouteSupabaseClient } from "@/lib/supabase/route";
import { resolvePostAuthDestination, safeAuthNext } from "@/modules/auth/onboarding";

async function destinationForUser(userId: string, requestedNext: string): Promise<string> {
  if (requestedNext !== "/portal") return requestedNext;

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

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requestedNext = safeAuthNext(url.searchParams.get("next"));
  const { supabase, applyCookies } = createRouteSupabaseClient(request);

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const destination = await destinationForUser(data.user.id, requestedNext);
      return applyCookies(NextResponse.redirect(new URL(destination, url.origin)));
    }
    return applyCookies(
      NextResponse.redirect(new URL("/login?error=oauth-callback", url.origin), 303),
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const destination = await destinationForUser(user.id, requestedNext);
    return applyCookies(NextResponse.redirect(new URL(destination, url.origin)));
  }

  return applyCookies(NextResponse.redirect(new URL("/login", url.origin), 303));
}
