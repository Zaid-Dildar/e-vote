import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });

  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
    path: "/",
    expires: new Date(0), // Expire the cookie immediately
  });

  return response;
}
