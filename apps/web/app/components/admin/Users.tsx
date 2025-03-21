"use client";

import { useEffect, useState } from "react";
import { Input } from "@components/UI/Input"; // Assuming you have a custom Input component
import { Search, PlusIcon, Users } from "lucide-react";
import UsersTable from "./UsersTable";
import SkeletonTable from "./SkeletonTable";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  biometricRegistered?: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4">
        <Users size={30} /> Users List
      </h1>

      {/* Search Bar and Add User Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Search Bar (70% width on larger screens, full width on smaller screens) */}
        <div className="relative w-full sm:w-[70%]">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full border rounded-md p-2"
          />
        </div>

        {/* Add User Button (30% width on larger screens, full width on smaller screens) */}
        <button
          onClick={() => console.log("Add User clicked")} // Add your logic here
          className="cursor-pointer group relative overflow-hidden shadow-md w-full sm:w-[30%] flex items-center justify-center gap-2 bg-[#112B4F] text-white rounded-md p-2 hover:bg-[#0E223A] transition-colors"
        >
          <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-10 h-30 bg-white opacity-10 rotate-6 translate-x-60 group-hover:-translate-x-60 transition-all duration-1000 ease" />
          <PlusIcon size={18} /> {/* Add User icon */}
          <span>Add User</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={8} columns={7} />
      ) : (
        <UsersTable users={users} searchTerm={searchTerm} />
      )}
    </div>
  );
}
