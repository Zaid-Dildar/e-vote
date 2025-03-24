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
// POST a new election
export async function POST(request: Request) {
  try {
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

    // Call the API to create a new election
    const newElection = await apiFetch("/api/elections", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(electionData),
    });

    // Return the created election
    return NextResponse.json(
      { message: "Election created successfully", election: newElection },
      { status: 201 }
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
