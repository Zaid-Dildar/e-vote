import mongoose, { Schema } from "mongoose";
import { AuditLog, Candidate, ElectionType } from "../types/Election";

// Define the Candidate schema
const CandidateSchema = new Schema<Candidate>({
  name: { type: String, required: true }, // Name of the candidate
  picture: { type: String, required: true }, // URL or path to the candidate's picture
});

// Define the Audit Log schema
const AuditLogSchema = new Schema<AuditLog>(
  {
    action: { type: String, required: true }, // Description of the action
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User who performed the action
    timestamp: { type: Date, default: Date.now }, // When the action was performed
  },
  { _id: false } // Disable automatic _id for audit logs
);

// Define the Election schema
const ElectionSchema = new Schema<ElectionType>(
  {
    name: { type: String, required: true }, // Name of the election
    department: { type: String, required: true }, // Department associated with the election
    position: { type: String, required: true }, // Position being contested
    startTime: { type: Date, required: true }, // Start time of the election
    endTime: { type: Date, required: true }, // End time of the election
    candidates: [CandidateSchema], // Array of candidates (with _id)
    auditLogs: [AuditLogSchema], // Array of audit logs
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the Election model
const Election = mongoose.model("Election", ElectionSchema);
export default Election;
