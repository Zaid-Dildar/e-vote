import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model";

dotenv.config();

const createUsers = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not set in .env file");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Delete all existing users before adding new ones
    await User.deleteMany({});
    console.log("🗑️ Deleted all existing users");

    const users = [
      {
        name: "Test User 1",
        email: "test2@example.com",
        department: "CSE",
        role: "voter",
        password: "password1234", // If passwords are hashed, hash before inserting
        biometricRegistered: true,
        faceIdKey: "sample-face-id-key",
        fingerprintKey: "sample-fingerprint-key",
      },
      {
        name: "Test User 2",
        email: "test3@example.com",
        department: "CSE",
        role: "voter",
        password: "password12345",
      },
      {
        name: "Test User 3",
        email: "test4@example.com",
        department: "CSE",
        role: "voter",
        password: "password123456",
        biometricRegistered: true,
        faceIdKey: "sample-face-id-key",
      },
    ];

    // Use insertMany for better performance
    await User.insertMany(users);
    console.log("✅ Test users created successfully!");
  } catch (error) {
    console.error("❌ Error creating users:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
  }
};

createUsers();
