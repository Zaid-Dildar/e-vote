import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, credential } = body;

    if (!userId || !credential) {
      return NextResponse.json(
        { message: "All fields (userId and credential) are required" },
        { status: 400 }
      );
    }

    const response = await apiFetch("/api/auth/biometric/register/verify", {
      method: "POST",
      body: JSON.stringify({ userId, credential }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.success) {
      return NextResponse.json(
        { message: "Biometric verification failed" },
        { status: response.status || 400 }
      );
    }
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error verifying biometric authentication:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
