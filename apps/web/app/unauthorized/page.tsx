"use client";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
      <p className="mt-2 text-gray-600">
        You do not have permission to access this page.
      </p>
      <button
        onClick={() => router.back()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Go Back
      </button>
    </div>
  );
}
