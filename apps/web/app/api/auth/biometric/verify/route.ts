import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@lib/api";

export async function POST(req: NextRequest) {
  try {
    const { userId, credentialId, signedChallenge } = await req.json();

    if (!userId || !credentialId || !signedChallenge) {
      return NextResponse.json(
        {
          message: "User ID, credential ID, and signed challenge are required",
        },
        { status: 400 }
      );
    }

    // Call the backend API to verify the biometric data
    const response = await apiFetch("/api/auth/biometric/verify", {
      method: "POST",
      body: JSON.stringify({
        userId,
        credentialId,
        signedChallenge,
      }),
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
