import { useState } from "react";
import { Calendar, CalendarCheck, Clock, Vote } from "lucide-react";
import VotingModal from "./VotingModal";

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

export default function ElectionCard({
  election,
  userVotes,
  result,
}: {
  election: Election;
  userVotes: VoteData[];
  result?: ElectionResult;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasVoted, setHasVoted] = useState(
    userVotes.some((vote) => vote.election === election._id)
  );

  const getElectionStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    if (now < new Date(startTime)) return "scheduled";
    if (now >= new Date(startTime) && now <= new Date(endTime))
      return "started";
    return "completed";
  };

  const electionStatus = getElectionStatus(
    election.startTime,
    election.endTime
  );
  const winnerCandidate = result?.winner
    ? election.candidates.find((c) => c._id === result.winner?.candidateId)
    : null;

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-4 pb-2 border hover:bg-gray-100 flex flex-col h-full">
        <h2 className="text-lg bg-[#112B4F] text-white font-bold -m-4 p-3 mb-2 rounded rounded-b-none">
          {election.name}
        </h2>

        <div className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          <Calendar className="w-4 h-4" /> Starts:{" "}
          {new Date(election.startTime).toLocaleString()}
        </div>
        <div className="text-sm text-gray-600 mb-2 flex items-center gap-1">
          <Calendar className="w-4 h-4" /> Ends:{" "}
          {new Date(election.endTime).toLocaleString()}
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

        <p className="text-sm text-gray-500">
          Candidates: {election.candidates.length}
        </p>

        <div className="mt-auto">
          {electionStatus === "completed" ? (
            <p className="text-green-600 font-bold text-center py-4 border-t">
              Winner: {winnerCandidate?.name ?? "None"}
            </p>
          ) : electionStatus === "scheduled" ? (
            <p className="text-gray-500 text-center py-4 border-t">
              Voting not started yet
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
