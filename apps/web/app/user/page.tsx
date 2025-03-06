"use client";

import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Welcome back!</h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Page;
