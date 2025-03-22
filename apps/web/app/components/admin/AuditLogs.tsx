"use client";

import { useEffect, useState } from "react";
import { Input } from "@components/UI/Input"; // Assuming you have a custom Input component
import { Search, ShieldCheck } from "lucide-react";

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
    user: string;
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!election) {
    return <div>Election not found</div>;
  }

  // Filter audit logs based on search term
  const filteredLogs = election.auditLogs.filter((log) =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4">
        <ShieldCheck size={30} /> Audit Logs for {election.name}
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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-[#112B4F] text-white">
              <th className="py-3 px-4 text-left">Action</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-gray-100" : "bg-white"
                  } hover:bg-gray-200 transition-colors`}
                >
                  <td className="py-3 px-4">{log.action}</td>
                  <td className="py-3 px-4">{log.user}</td>
                  <td className="py-3 px-4">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-3 px-4 text-center">
                  No audit logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
