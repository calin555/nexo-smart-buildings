import { NextRequest, NextResponse } from "next/server";

import { createRouteSupabaseClient } from "@/lib/supabase/route";
import { safeAuthNext } from "@/modules/auth/onboarding";
import { destinationForAuthenticatedUser } from "@/modules/auth/post-auth";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const requestedNext = safeAuthNext(url.searchParams.get("next"));
  const { supabase, applyCookies } = createRouteSupabaseClient(request);

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const destination = await destinationForAuthenticatedUser(data.user.id, requestedNext);
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
    const destination = await destinationForAuthenticatedUser(user.id, requestedNext);
    return applyCookies(NextResponse.redirect(new URL(destination, url.origin)));
  }

  return applyCookies(NextResponse.redirect(new URL("/login", url.origin), 303));
}
