import { NextResponse } from "next/server";
import { apiFetch } from "@lib/api"; // Import reusable function

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  biometricRegistered: boolean;
  createdAt: string;
  updatedAt: string;
};
// GET all users
export async function GET() {
  try {
    const users = await apiFetch("/api/users"); // Call API helper function
    return NextResponse.json(
      users
        .filter((x: User) => x.role !== "admin")
        .sort(
          (x: User, y: User) =>
            new Date(y.updatedAt).getTime() - new Date(x.updatedAt).getTime()
        )
    );
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

// POST a new user
export async function POST(request: Request) {
  try {
    // Parse the request body
    const userData = await request.json();

    // Validate the user data (optional, depending on your requirements)
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

    // Call the API to create a new user
    const newUser = await apiFetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Return the created user
    return NextResponse.json(
      { message: "User created successfully", user: newUser },
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
