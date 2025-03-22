import { Request, Response } from "express";
import * as electionService from "../services/election.service";

// Get all elections
export const getElections = async (req: Request, res: Response) => {
  try {
    const elections = await electionService.getAllElections();
    res.status(200).json(elections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching elections", error });
  }
};

// Get a single election by ID
export const getElectionById = async (req: Request, res: Response) => {
  try {
    const election = await electionService.getElectionById(req.params.id);
    if (!election) {
      res.status(404).json({ message: "Election not found" });
      return;
    }
    res.status(200).json(election);
  } catch (error) {
    res.status(500).json({ message: "Error fetching election", error });
  }
};

// Create a new election
export const createElection = async (req: Request, res: Response) => {
  try {
    const election = await electionService.createElection(req.body);
    res
      .status(201)
      .json({ message: "Election created successfully", election });
  } catch (error) {
    res.status(500).json({ message: "Error creating election", error });
  }
};

// Update an election by ID
export const updateElection = async (req: Request, res: Response) => {
  try {
    const updatedElection = await electionService.updateElection(
      req.params.id,
      req.body
    );
    if (!updatedElection) {
      res.status(404).json({ message: "Election not found" });
      return;
    }
    res
      .status(200)
      .json({ message: "Election updated successfully", updatedElection });
  } catch (error) {
    res.status(500).json({ message: "Error updating election", error });
  }
};

// Delete an election by ID
export const deleteElection = async (req: Request, res: Response) => {
  try {
    const deletedElection = await electionService.deleteElection(req.params.id);
    if (!deletedElection) {
      res.status(404).json({ message: "Election not found" });
      return;
    }
    res.status(200).json({ message: "Election deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting election", error });
  }
};
