"use client";

import { useEffect, useState } from "react";
import { Input } from "@components/UI/Input";
import { Search, PlusIcon, ListChecksIcon } from "lucide-react";
import ElectionsTable from "./ElectionsTable";
import SkeletonTable from "./SkeletonTable";
import ElectionModal from "./ElectionModal"; // Import the modal component
import toast from "react-hot-toast";

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
  updatedAt: Date;
  candidates: Candidate[];
}

export default function Elections() {
  const [elections, setElections] = useState<Election[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState<Election | null>(
    null
  );

  const fetchElections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/elections");
      if (!res.ok) throw new Error("Failed to fetch elections");
      const data: Election[] = await res.json();
      setElections(
        data.sort(
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
    fetchElections();
  }, []);

  const handleAddElection = () => {
    setSelectedElection(null); // Clear selected election for adding
    setIsModalOpen(true);
  };

  const handleEditElection = (election: Election) => {
    setSelectedElection(election); // Set selected election for editing
    setIsModalOpen(true);
  };

  const handleDeleteElection = async (electionId: string) => {
    try {
      const response = await fetch(`/api/admin/elections/${electionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete election");
      }

      const result = await response.json();
      fetchElections();
      toast.success(result.message);
    } catch (error) {
      toast.error(`${error}`);
      console.error("Error deleting election:", error);
    }
  };

  const handleSubmit = async (electionData: Partial<Election>) => {
    try {
      let response;
      if (selectedElection) {
        // Update existing election
        // Make sure we're preserving candidate _ids
        const updatedElectionData = {
          ...electionData,
          candidates: electionData.candidates?.map((candidate) => ({
            _id: candidate._id, // Preserve the _id if it exists
            name: candidate.name,
            picture: candidate.picture,
          })),
        };

        response = await fetch(`/api/admin/elections/${selectedElection._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedElectionData),
        });
      } else {
        // Add new election
        response = await fetch("/api/admin/elections", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(electionData),
        });
      }

      if (!response.ok) {
        throw new Error(
          `Failed to ${selectedElection ? "update" : "add"} election`
        );
      }

      const result = await response.json();
      toast.success(
        `${selectedElection ? "Updated" : "Added"} election:`,
        result
      );

      // Refresh the election list
      fetchElections();
    } catch (error) {
      toast.error(`${error}`);
      console.error(
        `Error ${selectedElection ? "updating" : "adding"} election:`,
        error
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4">
        <ListChecksIcon size={30} className="min-w-10 min-h-10" /> Elections
        List
      </h1>

      {/* Search Bar and Add Election Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative w-full sm:w-[70%]">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={18}
          />
          <Input
            type="text"
            placeholder="Search elections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full border rounded-md p-2"
          />
        </div>
        <button
          onClick={handleAddElection}
          className="cursor-pointer group relative overflow-hidden shadow-md w-full sm:w-[30%] flex items-center justify-center gap-2 bg-[#112B4F] text-white rounded-md p-2 hover:bg-[#0E223A] transition-colors"
        >
          <span className="max-sm:hidden group-disabled:hidden absolute -top-10 w-10 h-30 bg-white opacity-10 rotate-6 translate-x-60 group-hover:-translate-x-60 transition-all duration-1000 ease" />
          <PlusIcon size={18} />
          <span>Create Election</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={8} columns={9} />
      ) : (
        <ElectionsTable
          elections={elections}
          searchTerm={searchTerm}
          onEditElectionAction={handleEditElection}
          onDeleteElectionAction={handleDeleteElection}
        />
      )}

      {/* Modal */}
      <ElectionModal
        isOpen={isModalOpen}
        onCloseAction={() => {
          setIsModalOpen(false);
          setSelectedElection(null);
        }}
        onSubmitAction={handleSubmit}
        election={selectedElection}
      />
    </div>
  );
}
