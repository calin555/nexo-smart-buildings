import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
export async function GET(request: NextRequest): Promise<NextResponse> { const url = new URL(request.url); const code = url.searchParams.get("code"); const next = url.searchParams.get("next") ?? "/portal"; if (code) { const supabase = await createServerSupabaseClient(); await supabase.auth.exchangeCodeForSession(code); } return NextResponse.redirect(new URL(next.startsWith("/") ? next : "/portal", url.origin)); }
