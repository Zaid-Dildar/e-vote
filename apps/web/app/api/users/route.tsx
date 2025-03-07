import { NextResponse } from "next/server";
import { apiFetch } from "@lib/api"; // Import reusable function

export async function GET() {
  try {
    const users = await apiFetch("/api/users"); // Call API helper function
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
