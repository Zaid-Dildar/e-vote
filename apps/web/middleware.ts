import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const biometricRegistered =
    req.cookies.get("biometricRegistered")?.value === "true";
  const pathname = req.nextUrl.pathname;

  // ✅ Exclude auth-related API routes
  if (
    pathname.startsWith("/login") ||
    (!token && pathname.startsWith("/")) ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/logout") ||
    pathname.startsWith("/api/auth/biometric")
  ) {
    return NextResponse.next();
  }

  // ✅ Exclude Next.js static files and assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Restrict biometric registration route
  if (biometricRegistered && pathname === "/register-biometrics") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // ✅ Restrict other pages if biometric is NOT registered
  if (
    !biometricRegistered &&
    !["/register-biometrics", "/login", "/"].includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/register-biometrics", req.url));
  }

  // ✅ Role-Based Access Control
  if (!role) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Define role-based prefixes
  const rolePrefixes: Record<string, string> = {
    admin: "/admin",
    voter: "/user",
    auditor: "/audit",
  };

  const basePath = rolePrefixes[role] || "/"; // Default to "/" if role is missing

  // ✅ Only redirect if user is on a root path or unprefixed section
  const redirectPaths = ["/", "/users", "/elections", "/profile"];
  if (redirectPaths.includes(pathname) && !pathname.startsWith(basePath)) {
    return NextResponse.redirect(new URL(`${basePath}${pathname}`, req.url));
  }

  return NextResponse.next();
}

// ✅ Apply middleware to relevant routes
export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/user/:path*",
    "/audit/:path*",
    "/:path*", // Catch all paths for role-based redirection
  ],
};
