"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { useUserStore } from "../../store/userStore"; // Adjust the import path as needed
import { Input } from "@components/UI/Input"; // Adjust the import path as needed
import { UserCog } from "lucide-react";

type ApiError = {
  message: string;
  error?: {
    message: string;
    status?: number;
  };
};

export default function AdminProfileSettings() {
  const { user, setUser } = useUserStore(); // Fetch user data and update function from the store
  const [generalInfo, setGeneralInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    department: user?.department || "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    setGeneralInfo({
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "",
      department: user?.department || "",
    });
  }, [user]);

  // Zod schema for general information validation
  const generalInfoSchema = z.object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 50 characters"),
    email: z.string().email("Invalid email format"),
    role: z.string().min(1, "Role is required"),
    department: z.string().min(1, "Department is required"),
  });

  // Zod schema for password change validation
  const passwordSchema = z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z
        .string()
        .min(6, "New password must be at least 6 characters")
        .max(30, "New password must be less than 30 characters"),
      confirmNewPassword: z.string().min(1, "Confirm new password is required"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "New passwords do not match",
      path: ["confirmNewPassword"],
    });

  const handleSaveGeneralInfo = async () => {
    try {
      const result = generalInfoSchema.safeParse(generalInfo);
      if (!result.success) {
        result.error.errors.forEach((err) => {
          toast.error(err.message);
        });
        return;
      }

      const updatedUser = { ...user, ...generalInfo };
      delete updatedUser.id;
      delete updatedUser.token;

      const response = await fetch(`/api/audit/users/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          (data as ApiError)?.error?.message ||
            (data as ApiError)?.message ||
            "Failed to update profile"
        );
      }

      toast.success("Profile updated successfully");
      setUser({
        id: data.updatedUser._id,
        email: data.updatedUser.email,
        department: data.updatedUser.department,
        biometricRegistered: data.updatedUser.biometricRegistered,
        name: data.updatedUser.name,
        password: data.updatedUser.password,
        role: data.updatedUser.role,
        token: user?.token || "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      console.error("Error updating profile:", error);
    }
  };

  const handleChangePassword = async () => {
    try {
      // Validate the password inputs
      const result = passwordSchema.safeParse({
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      if (!result.success) {
        // Display validation errors using toast
        result.error.errors.forEach((err) => {
          toast.error(err.message);
        });
        return; // Stop submission if validation fails
      }

      const isCorrect = await bcrypt.compare(
        currentPassword,
        user?.password ?? ""
      );
      if (!isCorrect) {
        toast.error("Incorrect Current Password");
        return;
      }
      // Call the API to change the password
      const updatedUser = { ...user, password: newPassword };
      delete updatedUser.id;
      delete updatedUser.token;

      //   Call the API to update general information
      const response = await fetch(`/api/audit/users/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to update password");
      }

      const data = await response.json();
      toast.success("Password updated successfully");

      // Update the user store with the new information
      setUser({
        id: data.updatedUser._id,
        email: data.updatedUser.email,
        department: data.updatedUser.department,
        biometricRegistered: data.updatedUser.biometricRegistered,
        name: data.updatedUser.name,
        password: data.updatedUser.password,
        role: data.updatedUser.role,
        token: user?.token || "",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(`${error instanceof Error ? error.message : error}`);
      console.error("Error changing password:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4">
        <UserCog size={30} className="min-w-10 min-h-10" />
        Admin Profile Settings
      </h1>

      {/* General Settings Section */}
      <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">General Information</h2>
        <div className="space-y-4">
          <div>
            <label className="p-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              type="text"
              value={generalInfo.name}
              onChange={(e) =>
                setGeneralInfo({ ...generalInfo, name: e.target.value })
              }
              className="w-full p-2 border rounded-md bg-gray-50"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="p-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              value={generalInfo.email}
              onChange={(e) =>
                setGeneralInfo({ ...generalInfo, email: e.target.value })
              }
              className="w-full p-2 border rounded-md bg-gray-50"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="p-1 block text-sm font-medium text-gray-700">
              Role
            </label>
            <Input
              type="text"
              value={generalInfo.role}
              readOnly
              disabled
              className="w-full p-2 border rounded-md bg-gray-50"
              placeholder="Enter your role"
            />
          </div>
          <div>
            <label className="p-1 block text-sm font-medium text-gray-700">
              Department
            </label>
            <Input
              type="text"
              value={generalInfo.department}
              readOnly
              disabled
              className="w-full p-2 border rounded-md bg-gray-50"
              placeholder="Enter your department"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveGeneralInfo}
              className="px-6 py-2 bg-[#112B4F] text-white rounded-md hover:bg-[#0E223A] cursor-pointer group relative overflow-hidden shadow-md"
            >
              <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-8 h-30 bg-white opacity-10 rotate-6 translate-x-30 group-hover:-translate-x-30 transition-all duration-1000 ease" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-gray-100 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="p-1 block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-50"
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="p-1 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-50"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="p-1 block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <Input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full p-2 border rounded-md bg-gray-50"
              placeholder="Confirm new password"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleChangePassword}
              className="px-6 py-2 bg-[#112B4F] text-white rounded-md hover:bg-[#0E223A] cursor-pointer group relative overflow-hidden shadow-md"
            >
              <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-8 h-30 bg-white opacity-10 rotate-6 translate-x-40 group-hover:-translate-x-30 transition-all duration-1000 ease" />
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
