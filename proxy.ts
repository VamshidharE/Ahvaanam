import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define route groups
  const protectedRoutes = ["/admin", "/dashboard", "/settings", "/media", "/create"];
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  // 2. Initialize response with incoming request headers
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 3. Create Supabase client passing request/response references to handle cookie writes
  const supabase = await createClient(request, response);

  // 4. Retrieve user session (this automatically refreshes expired sessions)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 5. Handle protected paths redirection
  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    
    // Create redirect and preserve any refreshed auth session cookies
    const redirectResponse = NextResponse.redirect(loginUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // 6. Handle logged-in users attempting to access login/signup pages
  if (isAuthRoute && user) {
    const dashboardUrl = new URL("/dashboard", request.url);
    
    // Create redirect and preserve any refreshed auth session cookies
    const redirectResponse = NextResponse.redirect(dashboardUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/settings/:path*",
    "/media/:path*",
    "/create",
    "/create/:path*",
    "/login",
    "/signup",
  ],
};
