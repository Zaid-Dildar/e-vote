import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import Election from "../models/election.model";
import Vote from "../models/vote.model";

dotenv.config();

// CONFIG
const DELAY_MS = 1500;
const ADMIN_USER_ID = "67e4a19d5246c2c5357ab96d"; // replace with real admin ID

const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const runSeeding = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connected to MongoDB");

    // Delete previous votes and elections
    await Election.deleteMany({});
    await Vote.deleteMany({});
    console.log("🧹 Cleared existing elections and votes");

    const DEPARTMENTS = ["CSE", "IS", "EE"];
    const TOTAL_VOTERS = 70;
    // -------------------
    // 1. Fetch existing users (skip admin)
    // -------------------
    const allUsers = await User.find({ role: "voter" });
    const admin = await User.find({ _id: ADMIN_USER_ID });
    if (!admin) throw new Error("❌ Admin user not found");

    console.log(`👥 Found ${allUsers.length} voters`);
    // -------------------
    // 2. Create Elections (3 per department × 3 positions)
    // -------------------
    const POSITIONS = ["President", "Vice President", "Secretary"];
    const now = new Date();
    const elections: any[] = [];

    for (const dept of DEPARTMENTS) {
      for (const pos of POSITIONS) {
        const candidates = [
          {
            _id: new mongoose.Types.ObjectId(),
            name: `Candidate A `,
            picture:
              "https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png",
          },
          {
            _id: new mongoose.Types.ObjectId(),
            name: `Candidate B `,
            picture:
              "https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png",
          },
        ];

        const election = {
          name: `${dept} ${pos} Election`,
          department: dept,
          position: pos,
          startTime: new Date(now.getTime() - 1000 * 60), // already started
          endTime: new Date(now.getTime() + 1000 * 60 * 60), // ends in 1 hr
          candidates,
          auditLogs: [
            {
              action: `Election created for ${pos} in ${dept}`,
              user: ADMIN_USER_ID,
              timestamp: now,
            },
            {
              action: `Candidate added: ${candidates[0].name}`,
              user: ADMIN_USER_ID,
              timestamp: now,
            },
            {
              action: `Candidate added: ${candidates[1].name}`,
              user: ADMIN_USER_ID,
              timestamp: now,
            },
          ],
        };

        elections.push(election);
      }
    }

    const createdElections = await Election.insertMany(elections);
    console.log(`🗳️ Created ${createdElections.length} elections`);

    // -------------------
    // 3. Cast Votes Periodically (each user votes in one random election)
    // -------------------
    let voteCount = 1;

    for (const user of allUsers) {
      const election =
        createdElections[Math.floor(Math.random() * createdElections.length)];
      const candidate =
        election.candidates[
          Math.floor(Math.random() * election.candidates.length)
        ];

      const vote = new Vote({
        election: election._id,
        user: user._id,
        candidate: candidate._id,
        timestamp: new Date(),
      });

      await vote.save();

      await Election.updateOne(
        { _id: election._id },
        {
          $push: {
            auditLogs: {
              action: `Vote casted to: ${candidate.name}`,
              user: user._id,
              timestamp: new Date(),
            },
          },
        }
      );

      console.log(
        `🗳️ Vote ${voteCount++}: ${user.name} voted for ${candidate.name} in "${election.name}"`
      );

      await delay(DELAY_MS);
    }

    console.log("🎉 All users have voted. DB is ready for demo.");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
  }
};

runSeeding();
