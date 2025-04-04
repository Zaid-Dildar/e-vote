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
        onClick={() => router.replace("/")}
        className="cursor-pointer group relative overflow-hidden shadow-md mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-7 h-30 bg-white opacity-20 rotate-6 translate-x-30 group-hover:-translate-x-30 transition-all duration-1000 ease" />
        Go Back
      </button>
    </div>
  );
}
