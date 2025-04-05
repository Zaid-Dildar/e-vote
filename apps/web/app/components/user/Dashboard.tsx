"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  LayoutDashboard,
  Vote,
  RefreshCcw,
  Trophy,
  Percent,
  Award,
  CalendarDays,
  Gauge,
  Scale,
  Clock,
  TrendingUp,
  Users,
  Flame,
  Swords,
  CheckCircle,
} from "lucide-react";
import { useUserStore } from "../../store/userStore";
import toast from "react-hot-toast";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type Election = {
  _id: string;
  name: string;
  department: string;
  position: string;
  startTime: string;
  endTime: string;
  candidates: {
    _id: string;
    name: string;
    picture: string;
  }[];
};

type VoteData = {
  _id: string;
  election: string;
  candidate: string;
  timestamp: string;
};

type ElectionResultResponse = {
  message: string;
  result: {
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
  };
};

export default function VoterDashboard() {
  const { user } = useUserStore();
  const [votes, setVotes] = useState<VoteData[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [activeElections, setActiveElections] = useState<Election[]>([]);
  const [results, setResults] = useState<
    Record<string, ElectionResultResponse>
  >({});
  const [loading, setLoading] = useState({
    votes: true,
    elections: true,
    results: true,
  });

  const previousPositionsRef = useRef<Record<string, Record<string, number>>>(
    {}
  );
  const [previousVoteCounts, setPreviousVoteCounts] = useState<
    Record<string, Record<string, number>>
  >({});
  const [movementAnimations, setMovementAnimations] = useState<
    Record<string, Record<string, "up" | "down" | null>>
  >({});

  // Fetch user votes
  const fetchVotes = useCallback(async () => {
    if (!user?.id) return;

    setLoading((prev) => ({ ...prev, votes: true }));
    try {
      const res = await fetch("/api/user/votes/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user.id }),
      });
      if (!res.ok) throw new Error("Failed to fetch user votes");
      const data = await res.json();
      setVotes(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch votes"
      );
    } finally {
      setLoading((prev) => ({ ...prev, votes: false }));
    }
  }, [user?.id]);

  // Fetch elections data
  const fetchElections = useCallback(async () => {
    setLoading((prev) => ({ ...prev, elections: true }));
    try {
      const res = await fetch("/api/user/elections");
      if (!res.ok) throw new Error("Failed to fetch elections");
      const data = await res.json();
      setElections(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch elections"
      );
    } finally {
      setLoading((prev) => ({ ...prev, elections: false }));
    }
  }, []);

  // Fetch results for active elections
  const fetchResults = useCallback(async () => {
    if (activeElections.length === 0) return;

    setLoading((prev) => ({ ...prev, results: true }));
    try {
      const allResults: Record<string, ElectionResultResponse> = {};

      // Fetch results for each active election
      const resultFetches = activeElections.map(async (election) => {
        const res = await fetch(`/api/user/elections/${election._id}`);
        if (!res.ok)
          throw new Error(
            `Failed to fetch results for election ${election._id}`
          );
        const data: ElectionResultResponse = await res.json();
        allResults[election._id] = data;
      });

      await Promise.all(resultFetches);
      setResults(allResults);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch results"
      );
    } finally {
      setLoading((prev) => ({ ...prev, results: false }));
    }
  }, [activeElections]);

  // Determine active elections (current time is between start and end time)
  const updateActiveElections = useCallback(() => {
    const now = new Date();
    const active = elections.filter((election) => {
      const start = new Date(election.startTime);
      const end = new Date(election.endTime);
      return now >= start && now <= end;
    });
    setActiveElections(active);
  }, [elections]);

  // Initial data fetch
  useEffect(() => {
    fetchVotes();
    fetchElections();
  }, [fetchVotes, fetchElections]);

  // Update active elections when elections data changes
  useEffect(() => {
    if (elections.length > 0) {
      updateActiveElections();
      // Set up interval to check for active elections every minute
      const interval = setInterval(updateActiveElections, 60000);
      return () => clearInterval(interval);
    }
  }, [elections, updateActiveElections]);

  // Fetch results when active elections change
  useEffect(() => {
    if (activeElections.length > 0) {
      fetchResults();

      // Set up interval to update votes every 5 seconds for live updates
      const interval = setInterval(fetchResults, 5000);
      return () => clearInterval(interval);
    }
  }, [activeElections, fetchResults]);

  // Track candidate positions for animation
  const getCurrentPositions = useCallback(() => {
    const currentPositions: Record<string, Record<string, number>> = {};

    activeElections.forEach((election) => {
      currentPositions[election._id] = {};
      const electionResult = results[election._id]?.result;
      const sortedCandidates = electionResult?.candidates;

      sortedCandidates?.forEach((candidate, index) => {
        currentPositions[election._id]![candidate.candidateId] = index;
      });
    });

    return currentPositions;
  }, [activeElections, results]);

  // Update previous positions for animation tracking
  useEffect(() => {
    const currentPositions = getCurrentPositions();
    const newMovementAnimations: Record<
      string,
      Record<string, "up" | "down" | null>
    > = {};

    // Compare with previous positions to detect movement
    Object.keys(currentPositions).forEach((electionId) => {
      newMovementAnimations[electionId] = {};
      const electionCandidates = currentPositions[electionId];
      if (!electionCandidates) return;

      Object.keys(electionCandidates).forEach((candidateId) => {
        const newPos = electionCandidates[candidateId];
        const oldPos = previousPositionsRef.current[electionId]?.[candidateId];

        if (newPos !== undefined && oldPos !== undefined && newPos !== oldPos) {
          newMovementAnimations[electionId]![candidateId] =
            newPos < oldPos ? "up" : "down";
        } else {
          newMovementAnimations[electionId]![candidateId] = null;
        }
      });
    });

    setMovementAnimations(newMovementAnimations);
    previousPositionsRef.current = currentPositions;

    // Clear animations after they complete
    const timer = setTimeout(() => {
      setMovementAnimations({});
    }, 1000);

    return () => clearTimeout(timer);
  }, [results, activeElections, getCurrentPositions]);

  // Update previous vote counts for animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviousVoteCounts((prev) => {
        const newCounts = { ...prev };

        activeElections.forEach((election) => {
          if (!election?._id) return;

          newCounts[election._id] = newCounts[election._id] || {};
          const electionResult = results[election._id]?.result;

          electionResult?.candidates?.forEach((candidate) => {
            if (!candidate?.candidateId) return;
            newCounts[election._id]![candidate.candidateId] = candidate.votes;
          });
        });

        return newCounts;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [results, activeElections]);

  // Calculate statistics
  const calculateStats = useCallback(() => {
    if (!user || votes.length === 0 || elections.length === 0) return null;

    // Elections participated in
    const electionsParticipated = votes.length;

    // Win/loss ratio
    let wins = 0;
    votes.forEach((vote) => {
      const result = results[vote.election]?.result;
      if (result && result.winner?.candidateId === vote.candidate) {
        wins++;
      }
    });
    const winRatio = votes.length > 0 ? (wins / votes.length) * 100 : 0;

    // Votes by month
    const votesByMonth: Record<string, number> = {};
    votes.forEach((vote) => {
      const date = new Date(vote.timestamp);
      const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      votesByMonth[day] = (votesByMonth[day] || 0) + 1;
    });

    // Participation percentage
    const userDeptElections = elections.filter(
      (e) => e.department === user.department
    );
    const userDeptElectionIds = new Set(userDeptElections.map((e) => e._id));

    const participationPercentage =
      userDeptElections.length > 0
        ? (votes.filter((v) => userDeptElectionIds.has(v.election)).length /
            userDeptElections.length) *
          100
        : 0;

    return {
      electionsParticipated,
      wins,
      winRatio,
      votesByMonth,
      participationPercentage,
      userDeptElections: userDeptElections.length,
    };
  }, [votes, elections, results, user]);

  const stats = calculateStats();

  // Get competitiveness label and emoji
  const getCompetitiveness = (margin?: number) => {
    if (margin === undefined)
      return (
        <span className="flex items-center gap-1">
          <Scale className="w-8 h-8" /> Equal
        </span>
      );
    if (margin < 10)
      return (
        <span className="flex items-center gap-1">
          <Flame className="w-8 h-8 text-orange-500" /> Hotly contested
        </span>
      );
    if (margin < 30)
      return (
        <span className="flex items-center gap-1">
          <Swords className="w-8 h-8 text-gray-600" /> Close race
        </span>
      );
    if (margin < 50)
      return (
        <span className="flex items-center gap-1">
          <CheckCircle className="w-8 h-8 text-green-500" /> Clear win
        </span>
      );
    return (
      <span className="flex items-center gap-1">
        <Trophy className="w-8 h-8 text-amber-500" /> Landslide
      </span>
    );
  };

  // Prepare data for charts
  const votesByMonthData = {
    labels: stats ? Object.keys(stats.votesByMonth) : [],
    datasets: [
      {
        label: "Votes Cast",
        data: stats ? Object.values(stats.votesByMonth) : [],
        backgroundColor: "#112B4F",
      },
    ],
  };

  const participationData = {
    labels: ["Participated", "Did Not Participate"],
    datasets: [
      {
        data: stats
          ? [stats.participationPercentage, 100 - stats.participationPercentage]
          : [0, 100],
        backgroundColor: ["#112B4F", "#e5e7eb"],
      },
    ],
  };

  return (
    <div className="bg-gray-100 p-4 md:p-8 rounded-lg">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4">
        <LayoutDashboard size={30} className="min-w-10 min-h-10" />
        Voter Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Vote className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Engaged Elections</p>
              <h3 className="text-2xl font-bold">
                {loading.votes ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : (
                  stats?.electionsParticipated || 0
                )}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Trophy className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Win Ratio</p>
              <h3 className="text-2xl font-bold">
                {loading.votes ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : stats ? (
                  `${stats.winRatio.toFixed(1)}%`
                ) : (
                  "0%"
                )}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Percent className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Participation Rate</p>
              <h3 className="text-2xl font-bold">
                {loading.votes ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : stats ? (
                  `${stats.participationPercentage.toFixed(1)}%`
                ) : (
                  "0%"
                )}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <Award className="text-amber-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Successful Votes</p>
              <h3 className="text-2xl font-bold">
                {loading.votes ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : stats ? (
                  `${stats.wins} wins`
                ) : (
                  "0 wins"
                )}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CalendarDays className="w-5 h-5" /> Your Voting Activity
          </h2>
          <div className="h-64">
            {loading.votes ? (
              <div className="h-full flex items-center justify-center">
                <RefreshCcw className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <Bar
                data={votesByMonthData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        precision: 0,
                      },
                    },
                  },
                }}
              />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Gauge className="w-5 h-5" /> Department Participation
          </h2>
          <div className="h-64">
            {loading.votes ? (
              <div className="h-full flex items-center justify-center">
                <RefreshCcw className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <Pie
                data={participationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Percentage of elections in your department that you participated in
          </p>
        </div>
      </div>

      {/* Active Elections Section */}
      {activeElections.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Live Election Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeElections.map((election) => {
              const electionResult = results[election._id]?.result;
              const sortedCandidates = electionResult?.candidates;
              const totalVotes = electionResult?.totalVotes;
              const voteMargin = electionResult?.voteMargin ?? 0;
              const turnout = electionResult?.turnout;

              // Different colors for candidates
              const candidateColors = [
                "bg-blue-600",
                "bg-green-600",
                "bg-amber-600",
                "bg-purple-600",
                "bg-red-600",
              ];

              return (
                <div
                  key={election._id}
                  className="bg-white p-6 rounded-lg shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Vote className="text-blue-500" /> {election.name}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-1">
                        <Scale className="w-4 h-4" /> {election.position} -{" "}
                        {election.department}
                      </p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Live
                    </div>
                  </div>

                  <div className="space-y-4">
                    {sortedCandidates?.map((candidate, index) => {
                      const percentage = candidate.percentage.toFixed(2);

                      const prevCount =
                        previousVoteCounts[election._id]?.[
                          candidate.candidateId
                        ] || 0;
                      const hasNewVotes = candidate.votes > prevCount;

                      const isMoving =
                        movementAnimations[election._id]?.[
                          candidate.candidateId
                        ];

                      return (
                        <div
                          key={candidate.candidateId}
                          className={` 
                            relative 
                            transition-all 
                            duration-500 
                            ease-in-out
                            ${isMoving === "up" ? "animate-slide-up bg-green-50 rounded-lg p-1 -mx-1" : ""}
                            ${isMoving === "down" ? "animate-slide-down bg-red-50 rounded-lg p-1 -mx-1" : ""}
                          `}
                        >
                          {/* Movement indicator */}
                          {isMoving && (
                            <div
                              className={`
                                absolute 
                                left-0 
                                top-1/2 
                                transform 
                                -translate-x-full 
                                pr-2
                                ${isMoving === "up" ? "text-green-600" : "text-red-600"}
                              `}
                            >
                              <TrendingUp
                                className={`w-3 h-3 ${isMoving === "up" ? "" : "rotate-180"}`}
                              />
                            </div>
                          )}

                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium flex">
                              {candidate.name}
                              {index === 0 && (
                                <Award className="text-amber-600" />
                              )}
                            </span>
                            <span
                              className={`
                                text-sm 
                                font-medium 
                                transition-all 
                                ease-in-out
                                duration-200 
                                ${hasNewVotes ? "text-blue-600 scale-110" : "text-gray-900 scale-100"}
                              `}
                            >
                              {candidate.votes}{" "}
                              {candidate.votes !== 1 ? "votes" : "vote"} (
                              {percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`
                                h-2.5 
                                rounded-full 
                                ${candidateColors[index] || candidateColors[0]}
                              `}
                              style={{
                                width: `${percentage}%`,
                                transition: "width 0.5s ease-in-out",
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Vote className="w-4 h-4" /> Total votes cast:{" "}
                      {totalVotes}
                    </p>
                    {turnout && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Turnout: {turnout.voted}/{turnout.eligible} voters (
                        {turnout.percentage.toFixed(2)}%)
                      </p>
                    )}

                    {voteMargin !== null && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Vote Margin: {voteMargin.toFixed(2)}%
                      </p>
                    )}

                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Time remaining:{" "}
                      {(() => {
                        const diffMs =
                          new Date(election.endTime).getTime() - Date.now();
                        const hours = Math.max(
                          0,
                          Math.floor(diffMs / (1000 * 60 * 60))
                        );
                        const minutes = Math.max(
                          0,
                          Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
                        );
                        return `${hours} hours ${minutes} mins`;
                      })()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Voting History with Competitiveness */}
      <h2 className="text-xl font-semibold mb-4">Your Voting History</h2>
      <div className="bg-white rounded-lg shadow overflow-auto">
        {loading.votes ? (
          <div className="p-6 flex justify-center">
            <RefreshCcw className="w-5 h-5 animate-spin" />
          </div>
        ) : votes.length > 0 ? (
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Election
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Your Vote
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Competitiveness
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {votes.map((vote) => {
                const result = results[vote.election]?.result;
                const election = elections.find((e) => e._id === vote.election);
                const isElectionOngoing =
                  new Date(election?.endTime ?? "") > new Date();
                const candidate = election?.candidates.find(
                  (c) => c._id === vote.candidate
                );
                const isWinner = result?.winner?.candidateId === vote.candidate;

                // Get top two candidates for competitiveness
                const topCandidates =
                  result?.candidates
                    ?.sort((a, b) => b.percentage - a.percentage)
                    .slice(0, 2) || [];

                return (
                  <tr key={vote._id}>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {election?.name || "Unknown Election"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {election?.position || "Unknown Position"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(vote.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {candidate?.name || "Unknown Candidate"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isWinner
                            ? "bg-green-100 text-green-800"
                            : result?.winner
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {isWinner
                          ? isElectionOngoing
                            ? "Winning"
                            : "Won"
                          : result?.winner
                            ? isElectionOngoing
                              ? "Losing"
                              : "Lost"
                            : "Equal"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        {getCompetitiveness(result?.voteMargin)}
                        {result && (
                          <span className="text-xs text-gray-400">
                            (
                            {topCandidates
                              .map((c) => `${c.percentage.toFixed(0)}%`)
                              .join(" vs ")}
                            )
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No voting history found
          </div>
        )}
      </div>
    </div>
  );
}
