"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  password: string;
  biometricRegistered?: boolean;
}

interface UserModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onSubmitAction: (userData: Partial<User>) => void;
  onClearBiometrics?: (userId: string) => void; // Optional function to clear biometrics
  user?: User | null; // Optional user data for editing
}

// Define the Zod schema for client-side validation
const userSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email format"),
  role: z.enum(["admin", "voter", "auditor"]),
  department: z.string().min(1, "Department is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(30, "Password must be less than 30 characters")
    .optional(),
  biometricRegistered: z.boolean().default(false),
});

export default function UserModal({
  isOpen,
  onCloseAction,
  onSubmitAction,
  onClearBiometrics,
  user,
}: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "voter",
    department: "",
    password: "", // Password field is left empty by default
    biometricRegistered: false,
  });

  const modalRef = useRef<HTMLDivElement>(null); // Ref for the modal container

  // Prefill form if editing an existing user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        password: "", // Do not prefill the password field
        biometricRegistered: user.biometricRegistered || false,
      });
    } else {
      // Reset form for adding a new user
      setFormData({
        name: "",
        email: "",
        role: "voter",
        department: "",
        password: "",
        biometricRegistered: false,
      });
    }
  }, [user]);
  // Handle clicks outside the modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onCloseAction(); // Close the modal if clicked outside
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onCloseAction]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the data to be validated
    const dataToValidate = {
      ...formData,
      // Only include password in validation if it's not empty
      password: formData.password || undefined,
    };

    // Validate form data using Zod schema
    const result = userSchema.safeParse(dataToValidate);

    if (!result.success) {
      // Display validation errors using toast
      result.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      return; // Stop submission if validation fails
    }

    // Prepare the data to be submitted
    const userData: Partial<User> = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      biometricRegistered: formData.biometricRegistered,
    };

    // Only include the password if it has been changed
    if (formData.password) {
      userData.password = formData.password;
    }

    // Call onSubmitAction with the prepared data
    onSubmitAction(userData);
    onCloseAction(); // Close the modal
  };

  const handleClearBiometrics = () => {
    if (user && onClearBiometrics) {
      onClearBiometrics(user._id); // Call the function to clear biometrics
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-60 bg-black/70 bg-opacity-50 flex items-center justify-center p-4">
        <div
          ref={modalRef} // Attach the ref to the modal container
          className="bg-white rounded-lg w-full max-w-md max-h-[95%] overflow-auto"
        >
          <h2 className="text-white py-4 rounded-t text-xl text-center bg-[#112B4F] font-bold mb-4">
            {user ? "Edit User" : "Add User"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
                autoComplete="name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="admin">Admin</option>
                <option value="voter">Voter</option>
                <option value="auditor">Auditor</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                Department
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
                autoComplete="organization"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder={user ? "Leave blank to keep current password" : ""}
              />
            </div>
            {user?.biometricRegistered && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClearBiometrics}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer group relative overflow-hidden shadow-md"
                >
                  <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-8 h-30 bg-white opacity-10 rotate-6 translate-x-30 group-hover:-translate-x-30 transition-all duration-1000 ease" />
                  Clear Biometrics
                </button>
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCloseAction}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer group relative overflow-hidden shadow-md w-full"
              >
                <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-8 h-30 bg-white opacity-10 rotate-6 translate-x-40 group-hover:-translate-x-30 transition-all duration-1000 ease" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#112B4F] text-white rounded-md hover:bg-[#0E223A] cursor-pointer group relative overflow-hidden shadow-md w-full"
              >
                <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-8 h-30 bg-white opacity-10 rotate-6 translate-x-40 group-hover:-translate-x-30 transition-all duration-1000 ease" />
                {user ? "Save Changes" : "Add User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
