import { NextResponse } from "next/server";
import { apiFetch } from "@lib/api"; // Import reusable function

export async function GET(
  request: Request, // First argument is the request object
  { params }: { params: { electionId: string } } // Second argument is the params object
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
