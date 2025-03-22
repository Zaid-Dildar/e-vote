import { Schema } from "mongoose";

// Define the type for a vote
export interface VoteType {
  _id: string; // Unique identifier for the vote
  election: Schema.Types.ObjectId; // Reference to the election
  user: Schema.Types.ObjectId; // Reference to the user who cast the vote
  candidate: Schema.Types.ObjectId; // Reference to the candidate
  timestamp?: Date; // When the vote was cast (optional, defaults to now)
  createdAt?: Date; // When the vote was created (optional, added by Mongoose)
  updatedAt?: Date; // When the vote was last updated (optional, added by Mongoose)
}
