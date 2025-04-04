"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CheckCircle, Loader2, XCircle, Clock, Vote } from "lucide-react";
import { useUserStore } from "../../store/userStore";
import Image from "next/image";
import { getElectionResults } from "@lib/voteUtils";

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

export default function MyVotes() {
  const { user } = useUserStore();
  const [votes, setVotes] = useState<VoteData[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserVotes = async () => {
      try {
        // Fetch user's votes
        const votesRes = await fetch("/api/user/votes/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: user?.id }),
        });
        if (!votesRes.ok) throw new Error("Failed to fetch user votes");

        const votesData: VoteData[] = await votesRes.json();
        setVotes(votesData);

        // Fetch all elections
        const electionsRes = await fetch("/api/user/elections");
        if (!electionsRes.ok) throw new Error("Failed to fetch elections");

        const electionsData: Election[] = await electionsRes.json();

        // Filter only elections user has voted in
        const votedElections = electionsData.filter((election) =>
          votesData.some((vote) => vote.election === election._id)
        );

        setElections(votedElections);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };
    if (!user?.id) return;
    fetchUserVotes();
  }, [user?.id]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4">
        <CheckCircle size={30} className="min-w-10 min-h-10" /> My Votes
      </h1>

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin w-10 h-10 text-gray-600" />
        </div>
      ) : elections.length === 0 ? (
        <p className="text-gray-500 text-center">
          {"You haven't voted in any elections."}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {elections.map((election) => {
            const userVote = votes.find(
              (vote) => vote.election === election._id
            );
            const votedCandidate = election.candidates.find(
              (candidate) => candidate._id === userVote?.candidate
            );
            const { winnerId, voteCount } = getElectionResults(
              election._id,
              votes
            );
            const winnerCandidate = election.candidates.find(
              (candidate) => candidate._id === winnerId
            );

            const isElectionOngoing = new Date(election.endTime) > new Date();

            return (
              <div
                key={election._id}
                className="bg-white shadow-md rounded-lg p-4 border hover:bg-gray-100 flex flex-col h-full"
              >
                <h2 className="text-lg bg-[#112B4F] text-white font-bold -m-4 p-3 mb-2 rounded rounded-b-none">
                  {election.name}
                </h2>

                <p className="text-sm text-gray-600">
                  Department: {election.department}
                </p>
                <p className="text-sm text-gray-600">
                  Position: {election.position}
                </p>

                {isElectionOngoing ? (
                  <p className="text-yellow-600 flex items-center gap-1 mt-2 font-semibold">
                    <Clock className="w-5 h-5" /> Election is still ongoing.
                  </p>
                ) : (
                  <p className="text-blue-600 flex items-center gap-1 mt-2 font-semibold">
                    <Vote className="w-5 h-5" /> Election is completed.
                  </p>
                )}

                {/* Your Vote */}
                <div className="mt-3">
                  <p className="text-sm text-gray-500 font-semibold">
                    Your Vote:
                  </p>
                  {votedCandidate ? (
                    <div className="flex items-center justify-between bg-gray-200 p-2 rounded-md mt-1">
                      <div className="flex items-center gap-2">
                        <Image
                          src={votedCandidate.picture}
                          alt={votedCandidate.name}
                          height={100}
                          width={100}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-gray-700 font-medium">
                          {votedCandidate.name}
                        </span>
                      </div>
                      <span className="text-gray-700 text-sm font-semibold">
                        {voteCount[votedCandidate._id] ?? 0}
                        {`${voteCount[votedCandidate._id] === 1 ? " vote" : " votes"}`}
                      </span>
                    </div>
                  ) : (
                    <p className="text-red-500">Error: Candidate not found</p>
                  )}
                </div>

                {/* Election Winner */}
                <div className="mt-3">
                  <p className="text-sm text-gray-500 font-semibold">Winner:</p>
                  {winnerCandidate ? (
                    <div className="flex items-center justify-between bg-gray-200 p-2 rounded-md mt-1">
                      <div className="flex items-center gap-2">
                        <Image
                          src={winnerCandidate.picture}
                          alt={winnerCandidate.name}
                          height={100}
                          width={100}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-gray-700 font-medium">
                          {winnerCandidate.name}
                        </span>
                      </div>
                      <span className="text-gray-700 text-sm font-semibold">
                        {voteCount[winnerCandidate._id] ?? 0}
                        {`${voteCount[winnerCandidate._id] === 1 ? " vote" : " votes"}`}
                      </span>
                    </div>
                  ) : (
                    <p className="text-red-500">No winner yet.</p>
                  )}
                </div>

                {/* Win/Loss Status */}
                {votedCandidate && winnerCandidate && (
                  <p
                    className={`mt-2 flex justify-center items-center gap-1 text-sm font-semibold ${
                      winnerCandidate._id === votedCandidate._id
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {winnerCandidate._id === votedCandidate._id ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        {isElectionOngoing
                          ? "Your candidate is winning!"
                          : "Your candidate won!"}
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        {isElectionOngoing
                          ? "Your candidate is losing!"
                          : "Your candidate lost!"}
                      </>
                    )}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
