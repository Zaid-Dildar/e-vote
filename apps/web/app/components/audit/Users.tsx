"use client";

import { useEffect, useState } from "react";
import { Input } from "@components/UI/Input";
import { Search, Users } from "lucide-react";
import UsersTable from "./UsersTable";
import SkeletonTable from "./SkeletonTable";

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
  biometricRegistered?: boolean;
  updatedAt: Date;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/audit/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: User[] = await res.json();
      // Sort users by createdAt in descending order (latest first)
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4">
        <Users size={30} className="min-w-10 min-h-10" /> Users List
      </h1>

      {/* Search Bar and Add User Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative w-full">
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
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={8} columns={5} />
      ) : (
        <UsersTable users={users} searchTerm={searchTerm} />
      )}
    </div>
  );
}
