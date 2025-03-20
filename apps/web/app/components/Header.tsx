"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "../store/userStore";
import { LogOut } from "lucide-react";
import React from "react";

const Header = () => {
  const router = useRouter();
  const { user } = useUserStore();

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

  const truncateName = (name: string): string => {
    if (!name) return "User";

    // Trim extra spaces
    const trimmedName = name.trim();

    // If there's a space, take the first word and first letter of the second word
    const nameParts = trimmedName.split(" ");
    if (nameParts.length > 1) {
      const formattedName = `${nameParts[0]} ${nameParts[1] && nameParts[1][0]}.`;
      return formattedName.length <= 12
        ? formattedName
        : formattedName.slice(0, 12);
    }

    // If no spaces, just truncate to 12 characters
    return trimmedName.length > 12 ? trimmedName.slice(0, 12) : trimmedName;
  };

  return (
    <header className="sticky top-0 z-10 w-full bg-white shadow-md p-4 flex justify-between items-center md:px-8">
      <h1 className="ml-12 xl:ml-0 text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-[#112B4F] via-20% to-[#14386b] to-80% ">
        Welcome <span className="hidden md:inline">Back</span>,{" "}
        {truncateName(user?.name || "User")}
      </h1>

      <button
        className="group relative overflow-hidden cursor-pointer flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md transition"
        onClick={handleLogout}
      >
        <span
          className={`absolute -top-5 w-5 h-40 bg-white opacity-20 rotate-6 translate-x-40 group-hover:-translate-x-20 transition-all duration-1500 ease-in-out`}
        />
        <LogOut className="w-5 h-5" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </header>
  );
};

export default Header;
