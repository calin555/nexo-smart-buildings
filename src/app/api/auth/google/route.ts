import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createRouteSupabaseClient } from "@/lib/supabase/route";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    enforceRateLimit(`google-oauth:${request.headers.get("x-forwarded-for") ?? "local"}`);
    const { supabase, applyCookies } = createRouteSupabaseClient(request);
    const redirectTo = new URL("/auth/callback", env.NEXT_PUBLIC_SITE_URL);
    redirectTo.searchParams.set("next", "/portal");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo.toString(),
        skipBrowserRedirect: true,
      },
    });

    if (error || !data.url) {
      return NextResponse.redirect(new URL("/login?error=google", request.url), 303);
    }

    return applyCookies(NextResponse.redirect(data.url));
  } catch {
    return NextResponse.redirect(new URL("/login?error=google", request.url), 303);
  }
}
