import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value ?? "";
  const role = req.cookies.get("role")?.value ?? "";
  const pathname = req.nextUrl.pathname;

  console.log("🔍 Token:", token);
  console.log("🔍 Role:", role);
  console.log("🔍 Pathname:", pathname);

  if (!role) {
    console.log("❌ No role - Redirecting to /unauthorized");
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Define role-based access
  const protectedRoutes: Record<string, string[]> = {
    "/admin": ["admin"],
    "/user": ["admin", "voter", "auditor"],
    "/audit": ["auditor"],
  };

  // Check if the route is protected
  for (const route in protectedRoutes) {
    if (pathname.startsWith(route)) {
      if (!token || !role) {
        console.log("❌ No token or role - Redirecting to /login");
        return NextResponse.redirect(new URL("/login", req.url));
      } else if (
        protectedRoutes[route] &&
        !protectedRoutes[route].includes(role)
      ) {
        console.log("❌ Unauthorized role - Redirecting to /unauthorized");
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  console.log("✅ Access granted");
  return NextResponse.next();
}

// Apply middleware to relevant routes, excluding API calls
export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/audit/:path*"],
};
