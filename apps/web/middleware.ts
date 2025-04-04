import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const biometricRegistered =
    req.cookies.get("biometricRegistered")?.value === "true";
  const pathname = req.nextUrl.pathname;

  if (pathname === "/" && !token) {
    return NextResponse.next();
  }

  // ✅ Public routes that don't require authentication
  const publicRoutes = [
    "/login",
    "/api/auth/login",
    "/api/logout",
    "/api/auth/biometric",
    "/_next",
    "/favicon.ico",
    "/assets",
    "/unauthorized",
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // ✅ Check authentication
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ✅ Biometric registration enforcement
  if (biometricRegistered && pathname === "/register-biometrics") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (
    !biometricRegistered &&
    !["/register-biometrics", "/login", "/"].includes(pathname)
  ) {
    return NextResponse.redirect(new URL("/register-biometrics", req.url));
  }

  // ✅ Role validation
  if (!role) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // ✅ Define role-based access rules
  const roleAccess: Record<
    string,
    {
      uiPrefix: string;
      apiPrefix: string;
      allowedRoutes: string[];
    }
  > = {
    admin: {
      uiPrefix: "/admin",
      apiPrefix: "/api/admin",
      allowedRoutes: ["/api/admin", "/api/auth"], // Admins can access admin APIs and auth APIs
    },
    voter: {
      uiPrefix: "/user",
      apiPrefix: "/api/user",
      allowedRoutes: ["/api/user", "/api/auth"], // Users can access user APIs and auth APIs
    },
    auditor: {
      uiPrefix: "/audit",
      apiPrefix: "/api/audit",
      allowedRoutes: ["/api/audit", "/api/auth"], // Auditors can access audit APIs and auth APIs
    },
  };

  const currentRoleConfig = roleAccess[role];

  // ✅ API access control
  if (pathname.startsWith("/api")) {
    const isAllowed = currentRoleConfig?.allowedRoutes.some((prefix) =>
      pathname.startsWith(prefix)
    );

    if (!isAllowed) {
      return NextResponse.json(
        {
          message: "Unauthorized: You don't have permission to access this API",
        },
        { status: 403 }
      );
    }
  }

  // ✅ UI route redirection
  const basePath = currentRoleConfig?.uiPrefix;
  const redirectPaths = ["/", "/users", "/elections", "/profile", "/votes"];

  if (
    redirectPaths.includes(pathname) &&
    !pathname.startsWith(basePath || "")
  ) {
    return NextResponse.redirect(new URL(`${basePath}${pathname}`, req.url));
  }

  if (
    !pathname.startsWith(currentRoleConfig?.uiPrefix ?? "") &&
    !pathname.startsWith("/api") &&
    !(pathname === "/register-biometrics")
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
