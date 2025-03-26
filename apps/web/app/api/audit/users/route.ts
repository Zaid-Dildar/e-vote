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
        .filter((x: User) => x.role === "voter")
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
