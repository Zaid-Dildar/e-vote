import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@lib/api"; // Import your utility function

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Ensure all required fields are provided
    const { userId, credentialId, publicKey, deviceId } = body;
    if (!userId || !credentialId || !publicKey || !deviceId) {
      return NextResponse.json(
        {
          message:
            "All fields (userId, credentialId, publicKey, deviceId) are required",
        },
        { status: 400 }
      );
    }

    // Call the backend API
    const response = await apiFetch("/api/auth/biometric/register", {
      method: "POST",
      body: JSON.stringify({ userId, credentialId, publicKey, deviceId }),
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
