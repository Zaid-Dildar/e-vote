import { cookies } from "next/headers"; // Import cookies from Next.js

// types/api.d.ts or in your lib/api.ts file
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

// lib/api.ts
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData: ApiError = await res.json();
    const error: ApiFetchError = new Error(
      errorData.message || "Request failed"
    );
    error.data = errorData;
    throw error;
  }

  return res.json();
}
