import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export async function updateSession(request: NextRequest) {
  // If env vars are missing, we cannot create a supabase client
  if (!supabaseUrl || !supabaseKey) {
    if (request.nextUrl.pathname !== "/missing-db-config") {
      const url = request.nextUrl.clone();
      url.pathname = "/missing-db-config";
      return NextResponse.redirect(url);
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-browser cookies across mobile browsers.
  // https://supabase.com/docs/guides/auth/server-side/nextjs

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // previously the entire /dashboard tree was considered protected
  // and anonymous visitors were redirected to login. we now allow
  // anonymous read‑only access; individual pages perform their own role
  // checks and show "access denied" if necessary. only the login route
  // still needs special handling below.
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  // Schema check: we still want to detect uninitialised projects when
  // someone hits either the login page or any dashboard URL in order to
  // send them to the setup screen. keep using startsWith rather than the
  // old `isProtectedPath` boolean.
  if (
    isLoginPage ||
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    const { error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .limit(1);

    if (
      profileError &&
      (profileError.code === "PGRST205" || profileError.code === "42P01")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/setup";
      return NextResponse.redirect(url);
    }
  }

  // the only redirect we keep is moving logged‑in users away from the
  // login screen; we no longer force visitors to log in before viewing
  // any part of /dashboard.

  // Redirect users who are already logged in away from the login page
  if (isLoginPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
