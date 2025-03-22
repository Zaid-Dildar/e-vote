import { Schema } from "mongoose";

// Define the status type for elections
export enum ElectionStatus {
  SCHEDULED = "scheduled",
  STARTED = "started",
  COMPLETED = "completed",
}

// Define the type for a candidate
export interface Candidate {
  _id?: Schema.Types.ObjectId; // Optional _id for candidates
  name: string; // Name of the candidate
  picture: string; // URL or path to the candidate's picture
}

// Define the type for an audit log entry
export interface AuditLog {
  action: string; // Description of the action
  user: Schema.Types.ObjectId; // Reference to the user who performed the action
  timestamp?: Date; // When the action was performed (optional, defaults to now)
}

// Define the type for an election
export interface ElectionType {
  _id: string; // Unique identifier for the election
  name: string; // Name of the election
  department: string; // Department associated with the election
  position: string; // Position being contested
  startTime: Date; // Start time of the election
  endTime: Date; // End time of the election
  candidates: Candidate[]; // Array of candidates
  auditLogs: AuditLog[]; // Array of audit logs
  createdAt?: Date; // When the election was created (optional, added by Mongoose)
  updatedAt?: Date; // When the election was last updated (optional, added by Mongoose)
}
