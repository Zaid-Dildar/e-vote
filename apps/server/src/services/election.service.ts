import Election from "../models/election.model";
import { ElectionType } from "../types/Election";

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
