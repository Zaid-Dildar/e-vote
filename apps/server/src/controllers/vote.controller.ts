import { Request, Response } from "express";
import * as voteService from "../services/vote.service";

// Cast a vote
export const castVote = async (req: Request, res: Response) => {
  try {
    const vote = await voteService.castVote(req.body);
    res.status(201).json({ message: "Vote cast successfully", vote });
  } catch (error) {
    res.status(500).json({ message: "Error casting vote", error });
  }
};

// Get votes by election ID
export const getVotesByElection = async (req: Request, res: Response) => {
  try {
    const votes = await voteService.getVotesByElection(req.params.electionId);
    res.status(200).json(votes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching votes", error });
  }
};
