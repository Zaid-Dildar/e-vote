import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@lib/api"; // Ensure you have this helper function for making API calls

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
    const body = await request.json();

    if (!body.user) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Get vote data to the backend server
    const response = await apiFetch(`/api/votes/user/${body.user}`, {
      method: "Get",
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
