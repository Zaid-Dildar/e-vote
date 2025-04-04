import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@lib/api"; // Ensure you have this helper function for making API calls

type VotePayload = {
  election: string;
  user: string;
  candidate: string;
};
type ApiError = {
  message: string;
  error?: {
    message: string;
    status?: number;
  };
};

type ApiFetchError = Error & {
  data?: ApiError;
};

export async function POST(request: NextRequest) {
  try {
    const body: VotePayload = await request.json();
    console.log(body);
    if (!body.election || !body.user || !body.candidate) {
      return NextResponse.json(
        { message: "Election ID, User ID, and Candidate ID are required" },
        { status: 400 }
      );
    }

    // Send vote data to the backend server
    const response = await apiFetch("/api/votes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.log(error);

    if (error instanceof Error) {
      const apiError = error as ApiFetchError;
      if (apiError.data) {
        return NextResponse.json(
          {
            message: apiError.data.error?.message || apiError.message,
          },
          { status: apiError.data.error?.status || 500 }
        );
      }
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
