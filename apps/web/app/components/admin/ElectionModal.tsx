"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { z } from "zod";

interface Candidate {
  _id?: string;
  name: string;
  picture: string;
}

interface Election {
  _id: string;
  name: string;
  department: string;
  position: string;
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "started" | "completed";
  candidates: Candidate[];
}

interface ElectionModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  onSubmitAction: (electionData: Partial<Election>) => void;
  election?: Election | null; // Optional election data for editing
}

// Define the Zod schema for client-side validation
const electionSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be less than 100 characters"),
    department: z.string().min(1, "Department is required"),
    position: z.string().min(1, "Position is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    candidates: z
      .array(
        z.object({
          _id: z.string().optional(),
          name: z.string().min(1, "Candidate name is required"),
          picture: z.string().url("Candidate picture must be a valid URL"),
        })
      )
      .min(1, "At least one candidate is required"),
  })
  .refine(
    (data) => new Date(data.endTime) > new Date(data.startTime),
    "End time must be after start time"
  );

export default function ElectionModal({
  isOpen,
  onCloseAction,
  onSubmitAction,
  election,
}: ElectionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    position: "",
    startTime: "",
    endTime: "",
    candidates: [] as Candidate[],
  });

  const [newCandidate, setNewCandidate] = useState<Candidate>({
    name: "",
    picture: "",
  });

  const modalRef = useRef<HTMLDivElement>(null); // Ref for the modal container

  const formatLocalDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Prefill form if editing an existing election
  useEffect(() => {
    if (election) {
      setFormData({
        name: election.name,
        department: election.department,
        position: election.position,
        startTime: formatLocalDateTime(new Date(election.startTime)),
        endTime: formatLocalDateTime(new Date(election.endTime)),
        candidates: election.candidates,
      });
    } else {
      // Reset form for adding a new election
      setFormData({
        name: "",
        department: "",
        position: "",
        startTime: "",
        endTime: "",
        candidates: [],
      });
    }
  }, [election]);

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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCandidateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCandidate((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCandidate = () => {
    if (!newCandidate.name || !newCandidate.picture) {
      toast.error("Please fill in both candidate name and picture URL");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      candidates: [...prev.candidates, newCandidate],
    }));

    // Reset the new candidate fields
    setNewCandidate({ name: "", picture: "" });
  };

  const handleRemoveCandidate = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      candidates: prev.candidates.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data using Zod schema
    const result = electionSchema.safeParse(formData);

    if (!result.success) {
      // Display validation errors using toast
      result.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      return; // Stop submission if validation fails
    }

    // If validation passes, call onSubmitAction
    onSubmitAction({
      ...formData,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
    });
    onCloseAction(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-60 bg-black/70 bg-opacity-50 flex items-center justify-center p-4">
        <div
          ref={modalRef} // Attach the ref to the modal container
          className="bg-white rounded-lg w-full max-w-md md:max-w-xl lg:max-w-3xl max-h-[95%] overflow-auto"
        >
          <h2 className="text-white py-4 rounded-t text-xl text-center bg-[#112B4F] font-bold mb-4">
            {election ? "Edit Election" : "Create Election"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {/* Election Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                />
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
                />
              </div>
              <div>
                <label
                  htmlFor="position"
                  className="block text-sm font-medium text-gray-700"
                >
                  Position
                </label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  End Time
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
            </div>

            {/* Candidates Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Candidates</h3>
              {formData.candidates.map((candidate, index) => (
                <div
                  key={candidate._id || index}
                  className="flex items-center gap-2 mb-2"
                >
                  <Image
                    width={40}
                    height={40}
                    src={candidate.picture}
                    alt={candidate.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{candidate.name}</span>
                  {candidate._id && (
                    <span className="text-xs text-gray-500">
                      (ID: {candidate._id})
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveCandidate(index)}
                    className="cursor-pointer text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {/* Add Candidate Fields */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                <input
                  type="text"
                  placeholder="Candidate Name"
                  name="name"
                  value={newCandidate.name}
                  onChange={handleCandidateChange}
                  className="w-full p-2 border rounded-md md:col-span-3"
                />
                <input
                  type="url"
                  placeholder="Candidate Picture URL"
                  name="picture"
                  value={newCandidate.picture}
                  onChange={handleCandidateChange}
                  className="w-full p-2 border rounded-md md:col-span-3"
                />
                <button
                  type="button"
                  onClick={handleAddCandidate}
                  className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 md:col-span-1"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCloseAction}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 cursor-pointer group relative overflow-hidden shadow-md w-full"
              >
                <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-8 h-30 bg-white opacity-10 rotate-6 translate-x-60 group-hover:-translate-x-50 transition-all duration-1000 ease" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#112B4F] text-white rounded-md hover:bg-[#0E223A] cursor-pointer group relative overflow-hidden shadow-md w-full"
              >
                <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-8 h-30 bg-white opacity-10 rotate-6 translate-x-60 group-hover:-translate-x-50 transition-all duration-1000 ease" />
                {election ? "Save Changes" : "Create Election"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
