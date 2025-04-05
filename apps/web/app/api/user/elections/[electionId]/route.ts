import { NextResponse, NextRequest } from "next/server";
import { apiFetch } from "@lib/api"; // Import reusable function

// GET an election's result by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ electionId: string }> }
) {
  try {
    const { electionId } = await params;

    if (!electionId) {
      return NextResponse.json(
        { message: "Election ID is required" },
        { status: 400 }
      );
    }

    // Fetch user details using the userId
    const result = await apiFetch(`/api/elections/${electionId}/results`);

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
