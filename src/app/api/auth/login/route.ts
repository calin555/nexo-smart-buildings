import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { enforceRateLimit } from "@/lib/rate-limit";

const schema = z.object({ email: z.string().email(), password: z.string().min(8).max(128) });

export async function POST(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.redirect(new URL("/portal", request.url), 303);
  try {
    enforceRateLimit(`login:${request.headers.get("x-forwarded-for") ?? "local"}`);
    const form = await request.formData();
    const credentials = schema.parse({ email: form.get("email"), password: form.get("password") });
    const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      cookies: { getAll: () => request.cookies.getAll(), setAll: (items) => items.forEach(({ name, value, options }) => response.cookies.set(name, value, options)) },
    });
    const { error } = await supabase.auth.signInWithPassword(credentials);
    if (error) throw error;
    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?error=invalid", request.url), 303);
  }
}
