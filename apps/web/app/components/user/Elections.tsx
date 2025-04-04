"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ListChecksIcon, Loader2 } from "lucide-react";
import ElectionCard from "./ElectionCard"; // Import the card component

interface Candidate {
  _id: string;
  name: string;
  picture: string;
}

interface Election {
  _id: string;
  name: string;
  department: string;
  position: string;
  startTime: string;
  endTime: string;
  candidates: Candidate[];
}

export default function ElectionsPage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await fetch("/api/user/elections");
        if (!res.ok) throw new Error("Failed to fetch elections");

        const data = await res.json();
        setElections(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4">
        <ListChecksIcon size={30} className="min-w-10 min-h-10" /> Elections
      </h1>

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
        </div>
      ) : elections.length === 0 ? (
        <p className="text-gray-500 text-center">No elections available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {elections.map((election) => (
            <ElectionCard key={election._id} election={election} />
          ))}
        </div>
      )}
    </div>
  );
}
