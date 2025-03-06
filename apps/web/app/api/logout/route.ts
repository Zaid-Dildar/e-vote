import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });

  // Expire the token and role cookies
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
    path: "/",
    expires: new Date(0), // Expire immediately
  });

  response.cookies.set("role", "", {
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
    path: "/",
    expires: new Date(0), // Expire immediately
  });

  return response;
}
