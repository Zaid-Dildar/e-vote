import Vote from "../models/vote.model";
import { VoteType } from "../types/Vote";

// Cast a vote
export const castVote = async (voteData: VoteType): Promise<VoteType> => {
  const vote = new Vote(voteData);
  return await vote.save();
};

// Get votes by election ID
export const getVotesByElection = async (
  electionId: string
): Promise<VoteType[]> => {
  return await Vote.find({ election: electionId });
};
