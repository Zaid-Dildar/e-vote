import { Request, Response } from "express";
import * as electionService from "../services/election.service";

interface GetRequest extends Request {
  user?: { department: string; role: string }; // Adjust this type based on your actual user object
}

// Get all elections
export const getElections = async (req: GetRequest, res: Response) => {
  try {
    const userDepartment = req.user?.department;
    const userRole = req.user?.role;
    const elections = await electionService.getAllElections();
    const filteredElections = elections.filter(
      (election) => election.department === userDepartment
    );
    res.status(200).json(userRole === "voter" ? filteredElections : elections);
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

// Add to election.controller.ts
export const getElectionResults = async (req: Request, res: Response) => {
  try {
    const electionId = req.params.id;
    const result = await electionService.getElectionResults(electionId);
    res
      .status(200)
      .json({ message: "Election result fetched successfully", result });
  } catch (error) {
    if (error instanceof Error && error.message === "Election not found") {
      res.status(404).json({ message: error.message });
    } else {
      console.error("Error fetching election results:", error);
      res
        .status(500)
        .json({ message: "Error fetching election results", error });
    }
  }
};
