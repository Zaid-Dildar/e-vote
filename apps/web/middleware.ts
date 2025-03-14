import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const biometricRegistered =
    req.cookies.get("biometricRegistered")?.value === "true";
  const pathname = req.nextUrl.pathname;

  console.log("🚀 Middleware Debug:", {
    token,
    role,
    pathname,
    biometricRegistered,
  });

  // Skip token check for the login API route
  if (
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/biometric")
  ) {
    return NextResponse.next();
  }

  // ✅ Restrict biometric registration route
  if (biometricRegistered && pathname === "/register-biometrics") {
    console.log(
      "❌ User already registered biometrics - Redirecting to /unauthorized"
    );
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // ✅ Restrict other pages if biometric is NOT registered
  if (
    !biometricRegistered &&
    !["/register-biometrics", "/login", "/"].includes(pathname)
  ) {
    console.log("❌ User must register biometrics first - Redirecting");
    return NextResponse.redirect(new URL("/register-biometrics", req.url));
  }

  // ✅ 1️⃣ Token Check for API Requests
  if (pathname.startsWith("/api")) {
    if (!token) {
      console.log("❌ No token - Unauthorized API access");
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }
  }

  // ✅ 2️⃣ Role-Based Access for Frontend Pages
  if (!role) {
    console.log("❌ No role found - Redirecting to /unauthorized");
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

// ✅ Apply middleware to API calls and frontend routes (excluding /api/login)
export const config = {
  matcher: [
    "/api/:path*", // Apply to all API routes
    "/admin/:path*",
    "/user/:path*",
    "/audit/:path*",
    "/register-biometrics",
  ],
};
