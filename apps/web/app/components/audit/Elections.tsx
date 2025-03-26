"use client";

import { useEffect, useState } from "react";
import { Input } from "@components/UI/Input";
import { Search, ListChecksIcon } from "lucide-react";
import ElectionsTable from "./ElectionsTable";
import SkeletonTable from "./SkeletonTable";

interface Candidate {
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

  const fetchElections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/audit/elections");
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
  console.log([elections[0], elections[1]]);

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4">
        <ListChecksIcon size={30} className="min-w-10 min-h-10" /> Elections
        List
      </h1>

      {/* Search Bar and Add Election Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative w-full ">
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
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={8} columns={7} />
      ) : (
        <ElectionsTable elections={elections} searchTerm={searchTerm} />
      )}
    </div>
  );
}
