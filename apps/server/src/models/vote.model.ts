import mongoose, { Schema } from "mongoose";
import { VoteType } from "../types/Vote";

// Define the Vote schema
const VoteSchema = new Schema<VoteType>(
  {
    election: { type: Schema.Types.ObjectId, ref: "Election", required: true }, // Reference to the election
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who cast the vote
    candidate: { type: Schema.Types.ObjectId, required: true }, // Reference to the candidate (could be a candidate ID or name)
    timestamp: { type: Date, default: Date.now }, // When the vote was cast
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create the Vote model
const Vote = mongoose.model("Vote", VoteSchema);
export default Vote;
