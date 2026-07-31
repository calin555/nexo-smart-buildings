import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
const schema = z.object({ email: z.string().email() });
export async function POST(request: NextRequest): Promise<NextResponse> { const form = await request.formData(); const parsed = schema.safeParse({ email: form.get("email") }); if (parsed.success) { const supabase = await createServerSupabaseClient(); await supabase.auth.resetPasswordForEmail(parsed.data.email, { redirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/login` }); } return NextResponse.redirect(new URL("/login?reset=sent", request.url), 303); }
