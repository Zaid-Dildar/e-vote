import { useState, useEffect } from "react";
import { Calendar, CalendarCheck, Clock, Vote } from "lucide-react";
import VotingModal from "./VotingModal"; // Import modal component
import { useUserStore } from "../../store/userStore";
import { getElectionResults } from "@lib/voteUtils";
import toast from "react-hot-toast";

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

export default function ElectionCard({ election }: { election: Election }) {
  const { user } = useUserStore();
  const { name, startTime, endTime, candidates, _id } = election;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [votes, setVotes] = useState<VoteData[]>([]);

  const winnerCandidate = election.candidates.find(
    (candidate) => candidate._id === winnerId
  );

  useEffect(() => {
    if (votes.length > 0) {
      const { winnerId } = getElectionResults(_id, votes);
      setWinnerId(winnerId);
    } else {
      setWinnerId(null);
    }
  }, [votes, _id]);

  // Combine both vote fetches into one
  useEffect(() => {
    const fetchVotes = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const response = await fetch("/api/user/votes/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: user.id }),
        });

        if (!response.ok) throw new Error("Failed to fetch votes");

        const data: VoteData[] = await response.json();
        setVotes(data);

        // Check if user has voted in this election
        setHasVoted(data.some((vote) => vote.election === election._id));
      } catch (error) {
        console.error("Error fetching votes:", error);
        toast.error(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVotes();
  }, [user?.id, election._id]);

  const getElectionStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    if (now < new Date(startTime)) return "scheduled";
    if (now >= new Date(startTime) && now <= new Date(endTime))
      return "started";
    return "completed";
  };

  const electionStatus = getElectionStatus(startTime, endTime);

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-4 pb-2 border hover:bg-gray-100 flex flex-col h-full">
        <h2 className="text-lg bg-[#112B4F] text-white font-bold -m-4 p-3 mb-2 rounded rounded-b-none">
          {name}
        </h2>

        <div className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          <Calendar className="w-4 h-4" /> Starts:{" "}
          {new Date(startTime).toLocaleString()}
        </div>
        <div className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          <Calendar className="w-4 h-4" /> Ends:{" "}
          {new Date(endTime).toLocaleString()}
        </div>

        <div
          className={`px-2 py-1 rounded flex items-center gap-1 w-fit mt-1 mb-3 m-auto
          ${
            electionStatus === "scheduled"
              ? "bg-yellow-200 text-yellow-800"
              : electionStatus === "started"
                ? "bg-blue-200 text-blue-800"
                : "bg-green-200 text-green-800"
          }`}
        >
          {electionStatus === "scheduled" && (
            <CalendarCheck className="w-4 h-4" />
          )}
          {electionStatus === "started" && <Clock className="w-4 h-4" />}
          {electionStatus === "completed" && <Vote className="w-4 h-4" />}
          {electionStatus}
        </div>

        <p className="text-sm text-gray-500">Candidates: {candidates.length}</p>

        <div className="mt-auto">
          {electionStatus === "completed" ? (
            loading ? (
              <p className="text-center text-gray-500 py-4 border-t">
                Checking voting status...
              </p>
            ) : (
              <p className="text-green-600 font-bold text-center py-4 border-t">
                Winner: {winnerCandidate?.name ?? "None"}
              </p>
            )
          ) : electionStatus === "scheduled" ? (
            <p className="text-gray-500 text-center py-4 border-t">
              Voting not started yet
            </p>
          ) : loading ? (
            <p className="text-center text-gray-500 py-4 border-t">
              Checking voting status...
            </p>
          ) : hasVoted ? (
            <p className="text-green-600 font-bold text-center py-4 border-t">
              You have already voted
            </p>
          ) : (
            <div className="border-t py-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full px-6 py-2 bg-[#112B4F] text-white rounded-md hover:bg-[#0E223A] cursor-pointer shadow-md group relative"
              >
                <span className="max-lg:hidden group-disabled:hidden absolute -top-10 w-6 h-30 bg-white opacity-10 rotate-6 translate-x-50 group-hover:-translate-x-40 transition-all duration-1000 ease" />
                Vote Now
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <VotingModal
          electionId={election._id}
          isOpen={isModalOpen}
          candidates={election.candidates}
          onClose={() => setIsModalOpen(false)}
          onVoteSuccess={() => setHasVoted(true)}
        />
      )}
    </>
  );
}
