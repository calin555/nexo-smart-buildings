import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createRouteSupabaseClient } from "@/lib/supabase/route";
import { safeAuthNext } from "@/modules/auth/onboarding";
import { destinationForAuthenticatedUser } from "@/modules/auth/post-auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  next: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { supabase, applyCookies } = createRouteSupabaseClient(request);
  let requestedNext = "/portal";
  try {
    enforceRateLimit(`login:${request.headers.get("x-forwarded-for") ?? "local"}`);
    const form = await request.formData();
    const credentials = schema.parse({
      email: form.get("email"),
      password: form.get("password"),
      next: form.get("next") || undefined,
    });
    requestedNext = safeAuthNext(credentials.next ?? null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error || !data.user) throw error ?? new Error("Missing user");
    const destination = await destinationForAuthenticatedUser(data.user.id, requestedNext);
    return applyCookies(NextResponse.redirect(new URL(destination, request.url), 303));
  } catch {
    const errorUrl = new URL("/login", request.url);
    errorUrl.searchParams.set("error", "invalid");
    if (requestedNext !== "/portal") errorUrl.searchParams.set("next", requestedNext);
    return applyCookies(NextResponse.redirect(errorUrl, 303));
  }
}
