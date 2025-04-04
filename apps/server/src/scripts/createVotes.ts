import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Votes from "../models/vote.model";

dotenv.config();

const createVotes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connected to MongoDB");

    // Delete all existing users before adding new test users
    await Votes.deleteMany({});
    console.log("🗑️ Existing votes deleted");
  } catch (error) {
    console.error("❌ Error deleting votes:", error);
    process.exit(1); // Exit with failure code
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
  }
};

createVotes();
