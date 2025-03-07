import { cookies } from "next/headers"; // Import cookies from Next.js

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const cookieStore = cookies(); // Get cookies
  const token = (await cookieStore).get("token")?.value; // Await cookies()

  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}), // Merge custom headers
    Authorization: `Bearer ${token}`, // Add auth header
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Request failed");
  }

  return res.json(); // Return parsed JSON response
}
