import User from "../models/user.model";
import Vote from "../models/vote.model";
import Election from "../models/election.model";
import { ElectionType } from "../types/Election";

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

// Get all elections
export const getAllElections = async (): Promise<ElectionType[]> => {
  return await Election.find();
};

export const getElectionById = async (
  id: string
): Promise<ElectionType | null> => {
  return await Election.findById(id).populate({
    path: "auditLogs.user", // Path to the user field in auditLogs
    select: "name", // Select only the user's name (or other fields you need)
  });
};
// Create election
export const createElection = async (
  electionData: ElectionType
): Promise<ElectionType> => {
  const election = new Election(electionData);
  return await election.save();
};

// Update election
export const updateElection = async (
  id: string,
  electionData: Partial<ElectionType>
): Promise<ElectionType | null> => {
  return await Election.findByIdAndUpdate(id, electionData, {
    new: true,
    runValidators: true,
  });
};

// Delete election
export const deleteElection = async (
  id: string
): Promise<ElectionType | null> => {
  return await Election.findByIdAndDelete(id);
};

export const getElectionResults = async (
  electionId: string
): Promise<ElectionResult> => {
  // Get the election
  const election = await Election.findById(electionId);
  if (!election) {
    throw new Error("Election not found");
  }

  // Get all votes for this election
  const votes = await Vote.find({ election: electionId });

  // Count votes per candidate
  const voteCounts: Record<string, number> = {};
  election.candidates.forEach((candidate) => {
    voteCounts[candidate._id.toString()] = 0;
  });

  votes.forEach((vote) => {
    voteCounts[vote.candidate.toString()]++;
  });

  // Calculate total votes
  const totalVotes = votes.length;

  // Prepare candidate results
  const candidateResults = election.candidates.map((candidate) => ({
    candidateId: candidate._id.toString(),
    name: candidate.name,
    votes: voteCounts[candidate._id.toString()] || 0,
    percentage:
      totalVotes > 0
        ? (voteCounts[candidate._id.toString()] / totalVotes) * 100
        : 0,
  }));

  // Sort candidates by votes (descending)
  candidateResults.sort((a, b) => b.votes - a.votes);

  // Determine winner (if any)
  let winner = null;
  let voteMargin = undefined;

  if (candidateResults.length > 0) {
    if (candidateResults.length === 1) {
      // Only one candidate
      winner = {
        candidateId: candidateResults[0].candidateId,
        candidateName: candidateResults[0].name,
        votes: candidateResults[0].votes,
      };
    } else if (candidateResults[0].votes > candidateResults[1].votes) {
      // Clear winner
      winner = {
        candidateId: candidateResults[0].candidateId,
        candidateName: candidateResults[0].name,
        votes: candidateResults[0].votes,
      };
      voteMargin =
        candidateResults[0].percentage - candidateResults[1].percentage;
    }
    // Else it's a tie (winner remains null)
  }

  // Calculate turnout
  const eligibleVoters = await User.countDocuments({
    department: election.department,
    role: "voter", // Assuming only voters can vote
  });

  const turnout = {
    voted: totalVotes,
    eligible: eligibleVoters,
    percentage: eligibleVoters > 0 ? (totalVotes / eligibleVoters) * 100 : 0,
  };

  // Return final result
  return {
    winner,
    candidates: candidateResults,
    turnout,
    totalVotes,
    voteMargin,
  };
};
