import mongoose from "mongoose";
import dotenv from "dotenv";
import Election from "../models/election.model";
import Vote from "../models/vote.model";

dotenv.config();

const createElections = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connected to MongoDB");

    // Delete all existing elections and votes before adding new ones
    await Election.deleteMany({});
    await Vote.deleteMany({});
    console.log("🗑️ Existing elections and votes deleted");

    // Define user IDs for voters (from your provided data)
    const voterIds = [
      "67de6968faff8e75f1cd7a4c", // Voter 15
      "67de6968faff8e75f1cd7a4d", // Voter 16
      "67de6968faff8e75f1cd7a4e", // Voter 17
    ];

    // Define dummy elections
    const elections = [
      {
        name: "Student Council Election",
        department: "CSE",
        position: "President",
        startTime: new Date("2025-03-25T09:00:00"),
        endTime: new Date("2025-03-25T17:00:00"),
        candidates: [
          {
            _id: new mongoose.Types.ObjectId(),
            name: "John Doe",
            picture:
              "https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png",
          },
          {
            _id: new mongoose.Types.ObjectId(),
            name: "Jane Smith",
            picture:
              "https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png",
          },
        ],
        auditLogs: [
          {
            action: "Election created",
            user: "67de6968faff8e75f1cd7a3b", // Admin User ID
            timestamp: new Date("2025-03-22T07:40:24.979Z"),
          },
          {
            action: "Candidate added: John Doe",
            user: "67de6968faff8e75f1cd7a3b", // Admin User ID
            timestamp: new Date("2025-03-22T07:45:00.000Z"),
          },
          {
            action: "Candidate added: Jane Smith",
            user: "67de6968faff8e75f1cd7a3b", // Admin User ID
            timestamp: new Date("2025-03-22T07:50:00.000Z"),
          },
        ],
      },
      {
        name: "Faculty Election",
        department: "CSE",
        position: "Secretary",
        startTime: new Date("2025-03-26T10:00:00"),
        endTime: new Date("2025-03-26T18:00:00"),
        candidates: [
          {
            _id: new mongoose.Types.ObjectId(),
            name: "Alice Johnson",
            picture:
              "https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png",
          },
          {
            _id: new mongoose.Types.ObjectId(),
            name: "Bob Brown",
            picture:
              "https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png",
          },
        ],
        auditLogs: [
          {
            action: "Election created",
            user: "67de6968faff8e75f1cd7a3b", // Admin User ID
            timestamp: new Date("2025-03-22T08:00:00.000Z"),
          },
          {
            action: "Candidate added: Alice Johnson",
            user: "67de6968faff8e75f1cd7a3b", // Admin User ID
            timestamp: new Date("2025-03-22T08:05:00.000Z"),
          },
          {
            action: "Candidate added: Bob Brown",
            user: "67de6968faff8e75f1cd7a3b", // Admin User ID
            timestamp: new Date("2025-03-22T08:10:00.000Z"),
          },
        ],
      },
    ];

    // Insert elections into the database
    const createdElections = await Election.insertMany(elections);
    console.log("✅ Elections created successfully!");

    // Simulate votes cast by specific users
    const votes = [];
    for (const election of createdElections) {
      for (let i = 0; i < voterIds.length; i++) {
        const voterId = voterIds[i];
        const candidate = election.candidates[i % election.candidates.length]; // Alternate candidates
        votes.push({
          election: election._id,
          user: voterId,
          candidate: candidate._id,
          timestamp: new Date(),
        });
      }
    }

    // Insert votes into the database
    const createdVotes = await Vote.insertMany(votes);
    console.log("✅ Votes created successfully!");

    console.log("Created Elections:", createdElections);
    console.log("Created Votes:", createdVotes);
  } catch (error) {
    console.error("❌ Error creating elections and votes:", error);
    process.exit(1); // Exit with failure code
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
  }
};

createElections();
