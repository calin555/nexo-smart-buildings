import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
const schema = z.object({ email: z.string().email(), password: z.string().min(8).max(128) });
export async function POST(request: NextRequest): Promise<NextResponse> { try { enforceRateLimit(`login:${request.headers.get("x-forwarded-for") ?? "local"}`); const form = await request.formData(); const credentials = schema.parse({ email: form.get("email"), password: form.get("password") }); const supabase = await createServerSupabaseClient(); const { error } = await supabase.auth.signInWithPassword(credentials); if (error) throw error; return NextResponse.redirect(new URL("/portal", request.url), 303); } catch { return NextResponse.redirect(new URL("/login?error=invalid", request.url), 303); } }
