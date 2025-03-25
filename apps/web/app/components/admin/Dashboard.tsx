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
  Users,
  Clock,
  BarChart2,
  LayoutDashboard,
  Fingerprint,
  Vote,
  CalendarCheck,
  TrendingUp,
  Scale,
  RefreshCcw,
} from "lucide-react";

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

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  biometricRegistered: boolean;
  createdAt: string;
  updatedAt: string;
};

type AuditLogs = {
  action: string;
  user: {
    _id: string;
    name: string;
  };
};

type Election = {
  _id: string;
  name: string;
  department: string;
  position: string;
  startTime: string;
  endTime: string;
  candidates: {
    name: string;
    picture: string;
    _id: string;
  }[];
  auditLogs: AuditLogs[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type VoteType = {
  election: string;
  user: string;
  candidate: string;
  timestamp: Date;
};

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [elections, setElections] = useState<Election[]>([]);
  const [activeElections, setActiveElections] = useState<Election[]>([]);
  const [votes, setVotes] = useState<Record<string, VoteType[]>>({});
  const [loading, setLoading] = useState({
    users: true,
    elections: true,
    votes: true,
  });
  //   const [voteAnimations, setVoteAnimations] = useState<
  //     Record<string, Set<string>>
  //   >({});
  const previousPositionsRef = useRef<Record<string, Record<string, number>>>(
    {}
  );
  const [previousVoteCounts, setPreviousVoteCounts] = useState<
    Record<string, Record<string, number>>
  >({});
  const [movementAnimations, setMovementAnimations] = useState<
    Record<string, Record<string, "up" | "down" | null>>
  >({});

  // Fetch users data
  const fetchUsers = async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data: User[] = await res.json();
      setUsers(
        data
          .filter((x) => x.role !== "admin")
          .sort(
            (x, y) =>
              new Date(y.updatedAt).getTime() - new Date(x.updatedAt).getTime()
          )
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  // Fetch elections data
  const fetchElections = async () => {
    setLoading((prev) => ({ ...prev, elections: true }));
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
      setLoading((prev) => ({ ...prev, elections: false }));
    }
  };

  // Simulate fetching votes for active elections
  const fetchVotes = useCallback(async () => {
    setLoading((prev) => ({ ...prev, votes: true }));

    try {
      setVotes((prevVotes) => {
        const simulatedVotes: Record<string, VoteType[]> = { ...prevVotes };
        const newVoteAnimations: Record<string, Set<string>> = {};

        activeElections.forEach((election) => {
          // Initialize animation set for this election
          newVoteAnimations[election._id] = new Set();

          const electionVotes = simulatedVotes[election._id] || [];
          const newVotes: VoteType[] = [];

          const now = new Date();
          const start = new Date(election.startTime);
          const end = new Date(election.endTime);

          if (now >= start && now <= end) {
            election.candidates.forEach((candidate) => {
              const additionalVotes = Math.floor(Math.random() * 3);

              if (additionalVotes > 0) {
                // Add candidate to animations
                newVoteAnimations[election._id]?.add(candidate._id);

                for (let i = 0; i < additionalVotes; i++) {
                  newVotes.push({
                    election: election._id,
                    user: `simulated-user-${Date.now()}-${Math.random()
                      .toString(36)
                      .substr(2, 9)}`,
                    candidate: candidate._id,
                    timestamp: new Date(),
                  });
                }
              }
            });
          }

          simulatedVotes[election._id] = [...electionVotes, ...newVotes];
        });

        return simulatedVotes;
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((prev) => ({ ...prev, votes: false }));
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
    fetchUsers();
    fetchElections();
  }, []);

  // Update active elections when elections data changes
  useEffect(() => {
    if (elections.length > 0) {
      updateActiveElections();
      // Set up interval to check for active elections every minute
      const interval = setInterval(updateActiveElections, 60000);
      return () => clearInterval(interval);
    }
  }, [elections, updateActiveElections]);

  // Fetch votes when active elections change
  useEffect(() => {
    if (activeElections.length > 0) {
      fetchVotes();

      // Set up interval to update votes every 5 seconds for live updates
      const interval = setInterval(fetchVotes, 5000);

      return () => clearInterval(interval);
    }
  }, [activeElections, fetchVotes]);

  // Trigger animations when votes change
  useEffect(() => {
    const newAnimations: Record<string, Set<string>> = {};

    activeElections.forEach((election) => {
      newAnimations[election._id] = new Set();
      election.candidates.forEach((candidate) => {
        newAnimations[election._id]?.add(candidate._id);
      });
    });
  }, [votes, activeElections]);

  // Calculate user statistics
  const userStats = {
    total: users.length,
    byDepartment: users.reduce(
      (acc, user) => {
        acc[user.department] = (acc[user.department] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    biometricRegistered: users.filter((user) => user.biometricRegistered)
      .length,
  };

  // Calculate election statistics
  const electionStats = {
    total: elections.length,
    active: activeElections.length,
    byDepartment: elections.reduce(
      (acc, election) => {
        acc[election.department] = (acc[election.department] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
  };

  // Prepare data for charts
  const departmentUserData = {
    labels: Object.keys(userStats.byDepartment),
    datasets: [
      {
        label: "Users by Department",
        data: Object.values(userStats.byDepartment),
        backgroundColor: [
          "#3b82f6", // blue
          "#10b981", // emerald
          "#f59e0b", // amber
          "#ef4444", // red
          "#8b5cf6", // violet
        ],
      },
    ],
  };

  const biometricRegistrationData = {
    labels: ["Registered", "Not Registered"],
    datasets: [
      {
        data: [
          userStats.biometricRegistered,
          userStats.total - userStats.biometricRegistered,
        ],
        backgroundColor: ["#10b981", "#ef4433"],
      },
    ],
  };

  const departmentElectionData = {
    labels: Object.keys(electionStats.byDepartment),
    datasets: [
      {
        label: "Elections by Department",
        data: Object.values(electionStats.byDepartment),
        backgroundColor: [
          "#3b82f6", // blue
          "#10b981", // emerald
          "#f59e0b", // amber
          "#ef4444", // red
          "#8b5cf6", // violet
        ],
      },
    ],
  };

  const getElectionStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    if (now < new Date(startTime)) {
      return "scheduled";
    } else if (now >= new Date(startTime) && now <= new Date(endTime)) {
      return "started";
    } else {
      return "completed";
    }
  };

  // Track candidate positions for animation
  const getCurrentPositions = useCallback(() => {
    const currentPositions: Record<string, Record<string, number>> = {};

    activeElections.forEach((election) => {
      currentPositions[election._id] = {};
      const electionVotes = votes[election._id] || [];
      const sortedCandidates = [...election.candidates]
        .map((candidate) => ({
          ...candidate,
          count: electionVotes.filter((v) => v.candidate === candidate._id)
            .length,
        }))
        .sort((a, b) => b.count - a.count);

      sortedCandidates.forEach((candidate, index) => {
        currentPositions[election._id]![candidate._id] = index;
      });
    });

    return currentPositions;
  }, [activeElections, votes]);

  // Update previous positions for animation tracking
  useEffect(() => {
    const currentPositions = getCurrentPositions();
    const newMovementAnimations: Record<
      string,
      Record<string, "up" | "down" | null>
    > = {};

    // Compare with previous positions to detect movement
    Object.keys(currentPositions).forEach((electionId) => {
      // Initialize election record if it doesn't exist
      newMovementAnimations[electionId] = {};
      if (!newMovementAnimations[electionId]) {
        newMovementAnimations[electionId] = {};
      }
      const electionCandidates = currentPositions[electionId];
      if (!electionCandidates) return;

      Object.keys(electionCandidates).forEach((candidateId) => {
        const newPos = electionCandidates[candidateId];
        const oldPos = previousPositionsRef.current[electionId]?.[candidateId];

        if (newMovementAnimations[electionId]) {
          if (
            oldPos !== undefined &&
            newPos !== undefined &&
            newPos !== oldPos
          ) {
            newMovementAnimations[electionId]![candidateId] =
              newPos < oldPos ? "up" : "down";
          } else {
            newMovementAnimations[electionId]![candidateId] = null;
          }
        }
      });
    });

    setMovementAnimations(newMovementAnimations);
    previousPositionsRef.current = currentPositions;

    // Clear animations after they complete
    const timer = setTimeout(() => {
      setMovementAnimations({});
    }, 1000); // Match this with your animation duration

    return () => clearTimeout(timer);
  }, [votes, activeElections, getCurrentPositions, previousPositionsRef]);

  // Add this effect to clear the animation after it plays
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviousVoteCounts((prev) => {
        const newCounts = { ...prev };

        activeElections?.forEach((election) => {
          // Skip if election is invalid
          if (!election?._id) return;

          // Initialize election record
          newCounts[election._id] = newCounts[election._id] || {};

          const electionVotes = votes[election._id] || [];

          election.candidates?.forEach((candidate) => {
            // Skip if candidate is invalid
            if (!candidate?._id) return;

            newCounts[election._id] = {
              ...newCounts[election._id],
              [candidate._id]: electionVotes.filter(
                (v) => v.candidate === candidate._id
              ).length,
            };
          });
        });

        return newCounts;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [votes, activeElections]);
  return (
    <div className="bg-gray-100 p-4 md:p-8 rounded-lg">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-2xl font-bold mb-4">
        <LayoutDashboard size={30} className="min-w-10 min-h-10" />
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">
                {loading.users ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : (
                  userStats.total
                )}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Fingerprint className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Biometric Registered</p>
              <h3 className="text-2xl font-bold">
                {loading.users ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : (
                  userStats.biometricRegistered
                )}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <BarChart2 className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Total Elections</p>
              <h3 className="text-2xl font-bold">
                {loading.elections ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : (
                  electionStats.total
                )}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <Clock className="text-amber-600 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Active Elections</p>
              <h3 className="text-2xl font-bold">
                {loading.elections ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : (
                  electionStats.active
                )}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users by Department</h2>
          <div className="h-64">
            {loading.users ? (
              <div className="h-full flex items-center justify-center">
                <RefreshCcw className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <Bar
                data={departmentUserData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Biometric Registration</h2>
          <div className="h-64">
            {loading.users ? (
              <div className="h-full flex items-center justify-center">
                <RefreshCcw className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <Pie
                data={biometricRegistrationData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Elections by Department
          </h2>
          <div className="h-64">
            {loading.elections ? (
              <div className="h-full flex items-center justify-center">
                <RefreshCcw className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <Bar
                data={departmentElectionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <div className="h-64 overflow-y-auto">
            {loading.users ? (
              <div className="h-full flex items-center justify-center">
                <RefreshCcw className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.slice(0, 5).map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.biometricRegistered
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.biometricRegistered
                            ? "Registered"
                            : "Not Registered"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Active Elections Section */}
      {activeElections.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Live Election Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeElections.map((election) => {
              const electionVotes = votes[election._id] || [];
              const sortedCandidates = [...election.candidates]
                .map((candidate) => ({
                  ...candidate,
                  count: electionVotes.filter(
                    (v) => v.candidate === candidate._id
                  ).length,
                }))
                .sort((a, b) => b.count - a.count);

              const totalVotes = sortedCandidates.reduce(
                (sum, c) => sum + c.count,
                0
              );

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
                  {/* Election header remains the same */}

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
                    {sortedCandidates.map((candidate, index) => {
                      const percentage =
                        totalVotes > 0
                          ? Math.round((candidate.count / totalVotes) * 100)
                          : 0;

                      const prevCount =
                        previousVoteCounts[election._id]?.[candidate._id] || 0;
                      const hasNewVotes = candidate.count > prevCount;

                      const isMoving =
                        movementAnimations[election._id]?.[candidate._id];

                      return (
                        <div
                          key={candidate._id}
                          className={` 
        relative 
        transition-all 
        duration-500 
        ease-in-out
        ${isMoving === "up" ? "animate-slide-up" : ""}
        ${isMoving === "down" ? "animate-slide-down" : ""}
        ${isMoving ? "bg-green-50 rounded-lg p-1 -mx-1" : ""}
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
                            <span className="text-sm font-medium">
                              {candidate.name}
                            </span>
                            <span
                              className={`
            text-sm 
            font-medium 
            transition-all 
            duration-300 
            ${hasNewVotes ? "text-blue-600 scale-110" : "text-gray-900 scale-100"}
          `}
                            >
                              {candidate.count} votes ({percentage}%)
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

                  {/* Rest of the component remains the same */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Users className="w-4 h-4" /> Total votes cast:{" "}
                      {totalVotes}
                    </p>
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

      {/* Recent Elections Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Elections</h2>
        <div className="bg-white rounded-lg shadow overflow-auto">
          {loading.elections ? (
            <div className="p-6 flex justify-center">
              <RefreshCcw className="w-5 h-5 animate-spin" />
            </div>
          ) : (
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Election
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {elections.slice(0, 5).map((election) => {
                  const status = getElectionStatus(
                    election.startTime,
                    election.endTime
                  );

                  return (
                    <tr key={election._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {election.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {election.candidates.length} candidates
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {election.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {election.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(election.startTime).toLocaleDateString()} -{" "}
                        {new Date(election.endTime).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded flex items-center gap-1 w-fit ${
                            status === "scheduled"
                              ? "bg-yellow-200 text-yellow-800"
                              : status === "started"
                                ? "bg-blue-200 text-blue-800"
                                : "bg-green-200 text-green-800"
                          }`}
                        >
                          {status === "scheduled" && (
                            <CalendarCheck className="w-4 h-4" />
                          )}
                          {status === "started" && (
                            <Clock className="w-4 h-4" />
                          )}
                          {status === "completed" && (
                            <Vote className="w-4 h-4" />
                          )}
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
