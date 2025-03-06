import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model";

dotenv.config();

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ Connected to MongoDB");

    // Delete all existing users before adding new test users
    await User.deleteMany({});
    console.log("🗑️ Existing users deleted");

    // Function to hash passwords
    const hashPassword = async (password: string) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    const users = [
      {
        name: "Test User 1",
        email: "test2@example.com",
        department: "CSE",
        role: "voter",
        password: await hashPassword("password1234"), // Hashing manually
        biometricRegistered: true,
        faceIdKey: "sample-face-id-key",
        fingerprintKey: "sample-fingerprint-key",
      },
      {
        name: "Test User 2",
        email: "test3@example.com",
        department: "CSE",
        role: "voter",
        password: await hashPassword("password12345"),
      },
      {
        name: "Test User 3",
        email: "test4@example.com",
        department: "CSE",
        role: "voter",
        password: await hashPassword("password123456"),
        biometricRegistered: true,
        faceIdKey: "sample-face-id-key",
      },
    ];

    // Insert users into the database
    const createdUsers = await User.insertMany(users);

    console.log("✅ Test users created successfully!");
    console.log(createdUsers); // Log the users to verify insertion
  } catch (error) {
    console.error("❌ Error creating users:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
  }
};

createUser();
