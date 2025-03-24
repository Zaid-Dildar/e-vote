import { NextResponse, NextRequest } from "next/server";
import { apiFetch } from "@lib/api"; // Import reusable function

export async function GET(
  request: NextRequest,
  { params }: { params: { electionId: string } } // No need to wrap in Promise
) {
  try {
    const { electionId } = params; // Destructure directly

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

// PUT (update) an election by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { electionId: string } } // No need to wrap in Promise
) {
  try {
    const { electionId } = params; // Destructure directly

    // Check if electionId is provided
    if (!electionId) {
      return NextResponse.json(
        { message: "Election ID is required" },
        { status: 400 }
      );
    }

    // Parse the request body
    const electionData = await request.json();

    // Validate the election data (optional, depending on your requirements)
    if (
      !electionData.name ||
      !electionData.department ||
      !electionData.position ||
      !electionData.startTime ||
      !electionData.endTime ||
      !electionData.candidates
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure endTime is after startTime
    if (new Date(electionData.endTime) <= new Date(electionData.startTime)) {
      return NextResponse.json(
        { message: "End time must be after start time" },
        { status: 400 }
      );
    }

    // Ensure at least one candidate is provided
    if (electionData.candidates.length === 0) {
      return NextResponse.json(
        { message: "At least one candidate is required" },
        { status: 400 }
      );
    }

    // Call the API to update the election
    const updatedElection = await apiFetch(`/api/elections/${electionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(electionData),
    });

    // Return the updated election
    return NextResponse.json(
      { message: "Election updated successfully", election: updatedElection },
      { status: 200 }
    );
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

// DELETE an election by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { electionId: string } } // No need to wrap in Promise
) {
  try {
    const { electionId } = params; // Destructure directly

    if (!electionId) {
      return NextResponse.json(
        { message: "Election ID is required" },
        { status: 400 }
      );
    }

    // Call the API to delete the Election
    await apiFetch(`/api/elections/${electionId}`, {
      method: "DELETE",
    });

    // Return a success message
    return NextResponse.json(
      { message: "Election deleted successfully" },
      { status: 200 }
    );
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
