"use client";

import { useEffect, useState } from "react";
import { Input } from "@components/UI/Input"; // Assuming you have a custom Input component
import { Search, ShieldCheck } from "lucide-react";
import AuditLogsTable from "./AuditLogsTable"; // Import the new table component
import SkeletonTable from "./SkeletonTable";

interface Election {
  _id: string;
  name: string;
  department: string;
  position: string;
  startTime: Date;
  endTime: Date;
  status: "scheduled" | "started" | "completed";
  auditLogs: {
    action: string;
    user: {
      _id: string;
      name: string;
    };
    timestamp: Date;
  }[];
}

export default function AuditLogs({ electionId }: { electionId: string }) {
  const [election, setElection] = useState<Election | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchElectionAndLogs = async () => {
      try {
        // Fetch election details and audit logs
        const res = await fetch(`/api/admin/elections/${electionId}`);
        if (!res.ok) throw new Error("Failed to fetch election");
        const data: Election = await res.json();
        setElection(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchElectionAndLogs();
  }, [electionId]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4">
        <ShieldCheck size={30} className="min-w-10 min-h-10" /> Audit Logs for{" "}
        {election ? election.name : "Election"}
      </h1>

      {/* Search Bar */}
      <div className="relative w-full mb-4">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          size={18}
        />
        <Input
          type="text"
          placeholder="Search audit logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full border rounded-md p-2"
        />
      </div>

      {/* Audit Logs Table */}
      {loading ? (
        <SkeletonTable rows={5} columns={1} />
      ) : (
        election && (
          <AuditLogsTable
            auditLogs={election.auditLogs}
            searchTerm={searchTerm}
          />
        )
      )}
    </div>
  );
}
