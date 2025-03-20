"use client";

import { useEffect, useState } from "react";
import { Input } from "@components/UI/Input"; // Assuming you have a custom Input component
import { Search } from "lucide-react";
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
      <h1 className="text-2xl font-bold mb-4 lg:ml-7">Users List</h1>

      {/* Search Bar */}
      <div className="relative mb-4 lg:ml-7">
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

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={8} columns={7} />
      ) : (
        <UsersTable users={users} searchTerm={searchTerm} />
      )}
    </div>
  );
}
