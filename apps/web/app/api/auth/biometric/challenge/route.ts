import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@lib/api";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json(); // Extract userId from request body

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    console.log(`Fetching challenge for userId: ${userId}`);

    // Call the backend API with userId in the body
    const response = await apiFetch("/api/auth//biometric/challenge", {
      method: "POST",
      body: JSON.stringify({ userId }),
      headers: { "Content-Type": "application/json" },
    });

    console.log("Raw Response:", response);

    if (!response || typeof response !== "object") {
      return NextResponse.json(
        { message: "Invalid response from server" },
        { status: 500 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching biometric challenge:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
