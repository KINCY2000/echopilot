import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getClientEnv } from "@/lib/env";

/**
 * Routes reachable without a session. Everything else redirects to /login.
 * Keep this list in sync with app/**\/page.tsx and app/**\/route.ts.
 */
const PUBLIC_PATHS = ["/login", "/signup", "/signup/check-email", "/auth/callback"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

/**
 * Refreshes the Supabase session cookie on every request and enforces the
 * baseline auth gate (organization-membership checks happen deeper, in
 * app/dashboard/layout.tsx, since that needs a DB round trip this
 * Edge-runtime middleware intentionally avoids).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const env = getClientEnv();
  const supabase = createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Must call getUser() (not getSession()) here: it revalidates the token
  // against Supabase Auth instead of trusting an unverified cookie value.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && !isPublicPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}
