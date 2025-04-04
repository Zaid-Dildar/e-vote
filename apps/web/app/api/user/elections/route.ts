import { NextResponse } from "next/server";
import { apiFetch } from "@lib/api"; // Import reusable function

export async function GET() {
  try {
    const elections = await apiFetch("/api/elections"); // Call API helper function
    return NextResponse.json(elections);
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
