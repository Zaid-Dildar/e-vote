import mongoose from "mongoose";
import dotenv from "dotenv";
import Vote from "../models/vote.model";

dotenv.config();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Config
const DELAY_MS = 1500; // 1.5 seconds between votes
const ROUNDS = 5; // Total vote rounds

// Static Data
const elections = ["67e23bf4353e888dfc684862", "67e3f69422c588a2acc84f36"];

const users = [
  "67e4a19d5246c2c5357ab973",
  "67e4a19d5246c2c5357ab974",
  "67e4a19d5246c2c5357ab975",
  "67e4a19d5246c2c5357ab976",
  "67e4a19d5246c2c5357ab977",
  "67e4a19d5246c2c5357ab978",
  "67e4a19d5246c2c5357ab979",
  "67e4a19d5246c2c5357ab97a",
  "67e4a19d5246c2c5357ab97c",
  "67e4a19d5246c2c5357ab97d",
  "67e4a19d5246c2c5357ab97e",
  "67e4a19d5246c2c5357ab97f",
  "67e4a19d5246c2c5357ab980",
];

// Replace these with real candidate ObjectIds
const candidatesByElection: Record<string, string[]> = {
  "67e23bf4353e888dfc684862": [
    "67efbf05f6210726c17c08b3",
    "67efbf05f6210726c17c08b4",
    "67efbf05f6210726c17c08b5",
  ],
  "67e3f69422c588a2acc84f36": [
    "67efd8f8f6210726c17c0b21",
    "67efd8f8f6210726c17c0b22",
    "67efd8f8f6210726c17c0b23",
    "67efd8f8f6210726c17c0b24",
  ],
};

const createVotes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connected to MongoDB");

    await Vote.deleteMany({});
    console.log("🗑️ Existing votes deleted");

    let voteCount = 1;

    for (let round = 1; round <= ROUNDS; round++) {
      console.log(`\n🔁 Round ${round} started...\n`);

      for (const user of users) {
        const electionId =
          elections[Math.floor(Math.random() * elections.length)];
        const candidateIds = candidatesByElection[electionId];
        const candidateId =
          candidateIds[Math.floor(Math.random() * candidateIds.length)];

        const vote = new Vote({
          election: electionId,
          user,
          candidate: candidateId,
          timestamp: new Date(),
        });

        await vote.save();
        console.log(
          `🗳️ Vote ${voteCount++}: User ${user} voted for ${candidateId} in election ${electionId}`
        );

        await delay(DELAY_MS);
      }

      console.log(`✅ Round ${round} completed.`);
    }

    console.log(
      "\n🎉 All rounds completed. Live vote data should now show dynamic updates!"
    );
  } catch (error) {
    console.error("❌ Error creating votes:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
  }
};

createVotes();
