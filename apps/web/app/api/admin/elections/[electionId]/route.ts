import { NextResponse, NextRequest } from "next/server";
import { apiFetch } from "@lib/api"; // Import reusable function

export async function GET(
  request: NextRequest, // Use NextRequest instead of Request
  { params }: { params: { electionId: string } } // Access params from the request object
) {
  try {
    const { electionId } = params;

    if (!electionId) {
      return NextResponse.json(
        { message: "Election ID is required" },
        { status: 400 }
      );
    }

    // Fetch election details using the electionId
    const election = await apiFetch(`/api/elections/${electionId}`);

    return NextResponse.json(election);
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
