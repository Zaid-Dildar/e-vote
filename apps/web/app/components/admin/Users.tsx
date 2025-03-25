"use client";

import { useEffect, useState } from "react";
import { Input } from "@components/UI/Input";
import { Search, PlusIcon, Users } from "lucide-react";
import UsersTable from "./UsersTable";
import SkeletonTable from "./SkeletonTable";
import UserModal from "./UserModal"; // Import the modal component
import toast from "react-hot-toast";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: User[] = await res.json();
      // Sort users by createdAt in descending order (latest first)
      setUsers(
        data
          .filter((x) => x.role !== "admin")
          .sort(
            (x, y) =>
              new Date(y.updatedAt).getTime() - new Date(x.updatedAt).getTime()
          )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  console.log([users[0], users[1]]);
  const handleAddUser = () => {
    setSelectedUser(null); // Clear selected user for adding
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user); // Set selected user for editing
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      const result = await response.json();
      fetchUsers();
      toast.success(result.message);
    } catch (error) {
      toast.error(`${error}`);
      console.error("Error deleting user:", error);
    }
  };

  const handleClearBiometrics = (userId: string) => {
    console.log("Clearing biometrics for user:", userId);
    setIsModalOpen(false);

    // Add logic to clear biometrics for the user
  };

  const handleSubmit = async (userData: Partial<User>) => {
    try {
      let response;
      if (selectedUser) {
        // Update existing user
        if (userData.password === undefined)
          userData.password = selectedUser.password;
        response = await fetch(`/api/admin/users/${selectedUser._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      } else {
        // Add new user
        response = await fetch("/api/admin/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to ${selectedUser ? "update" : "add"} user`);
      }

      const result = await response.json();
      toast.success(`${selectedUser ? "Updated" : "Added"} user:`, result);

      // Optionally, you can refresh the user list or update the state here
      fetchUsers();
    } catch (error) {
      toast.error(`${error}`);
      console.error(
        `Error ${selectedUser ? "updating" : "adding"} user:`,
        error
      );
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4">
        <Users size={30} className="min-w-10 min-h-10" /> Users List
      </h1>

      {/* Search Bar and Add User Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
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
        <button
          onClick={handleAddUser}
          className="cursor-pointer group relative overflow-hidden shadow-md w-full sm:w-[30%] flex items-center justify-center gap-2 bg-[#112B4F] text-white rounded-md p-2 hover:bg-[#0E223A] transition-colors"
        >
          <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-10 h-30 bg-white opacity-10 rotate-6 translate-x-60 group-hover:-translate-x-60 transition-all duration-1000 ease" />
          <PlusIcon size={18} />
          <span>Add User</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={8} columns={7} />
      ) : (
        <UsersTable
          users={users}
          searchTerm={searchTerm}
          onEditUserAction={handleEditUser}
          onDeleteUserAction={handleDeleteUser}
        />
      )}

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onCloseAction={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmitAction={handleSubmit}
        onClearBiometrics={handleClearBiometrics}
        user={selectedUser}
      />
    </div>
  );
}
