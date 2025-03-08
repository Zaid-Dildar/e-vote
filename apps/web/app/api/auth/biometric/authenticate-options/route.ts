import { NextResponse } from "next/server";
import { apiFetch } from "@lib/api";

export async function GET() {
  try {
    const response = await apiFetch("/api/auth/biometric/authenticate/options");
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching registration options:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
