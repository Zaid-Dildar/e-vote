"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ListChecksIcon, Loader2 } from "lucide-react";
import ElectionCard from "./ElectionCard";
import { useUserStore } from "../../store/userStore";

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

interface VoteData {
  election: string;
  candidate: string;
}

interface ElectionResult {
  winner: {
    candidateId: string;
    candidateName: string;
    votes: number;
  } | null;
  candidates: {
    candidateId: string;
    name: string;
    votes: number;
    percentage: number;
  }[];
  turnout: {
    voted: number;
    eligible: number;
    percentage: number;
  };
  totalVotes: number;
  voteMargin?: number;
}

export default function ElectionsPage() {
  const { user } = useUserStore();
  const [elections, setElections] = useState<Election[]>([]);
  const [userVotes, setUserVotes] = useState<VoteData[]>([]);
  const [results, setResults] = useState<Record<string, ElectionResult>>({});
  const [loading, setLoading] = useState(true);

  const getElectionStatus = (start: string, end: string) => {
    const now = new Date();
    if (now < new Date(start)) return "scheduled";
    if (now >= new Date(start) && now <= new Date(end)) return "started";
    return "completed";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const electionsRes = await fetch("/api/user/elections");
        if (!electionsRes.ok) throw new Error("Failed to fetch elections");
        const electionsData: Election[] = await electionsRes.json();
        setElections(electionsData);

        const votesRes = await fetch("/api/user/votes/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: user?.id }),
        });

        if (!votesRes.ok) throw new Error("Failed to fetch votes");
        const votesData: VoteData[] = await votesRes.json();
        setUserVotes(votesData);

        const completedElections = electionsData.filter(
          (e) => getElectionStatus(e.startTime, e.endTime) === "completed"
        );

        const resultPromises = completedElections.map((e) =>
          fetch(`/api/user/elections/${e._id}`).then((res) => {
            if (!res.ok) throw new Error("Error fetching result");
            return res.json();
          })
        );

        const resultResponses = await Promise.all(resultPromises);

        const resultMap: Record<string, ElectionResult> = {};
        resultResponses.forEach((res, idx) => {
          if (completedElections[idx]) {
            resultMap[completedElections[idx]._id] = res.result;
          }
        });

        setResults(resultMap);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching election data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

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
            <ElectionCard
              key={election._id}
              election={election}
              userVotes={userVotes}
              result={results[election._id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
