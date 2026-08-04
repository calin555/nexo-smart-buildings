import "server-only";

import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";

export function createRouteSupabaseClient(request: NextRequest) {
  const cookieMutations: Array<(response: NextResponse) => void> = [];
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          for (const { name, value, options } of cookiesToSet) {
            cookieMutations.push((response) => response.cookies.set(name, value, options));
          }
        },
      },
    },
  );

  return {
    supabase,
    applyCookies(response: NextResponse): NextResponse {
      for (const mutate of cookieMutations) mutate(response);
      return response;
    },
  };
}
