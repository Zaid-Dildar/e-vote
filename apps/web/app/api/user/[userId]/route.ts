import { NextResponse, NextRequest } from "next/server";
import { apiFetch } from "@lib/api"; // Import reusable function

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

// GET a single user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch user details using the userId
    const user = await apiFetch(`/api/users/${userId}`);

    return NextResponse.json(user);
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

// PUT (update) a user by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const userData = await request.json();
    if (
      !userData.name ||
      !userData.email ||
      !userData.role ||
      !userData.department ||
      !userData.password
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const res = await apiFetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    return NextResponse.json(res, { status: 200 });
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
