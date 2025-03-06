import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model";
import bcrypt from "bcryptjs";

dotenv.config();

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    // Delete all existing users before adding a new test user
    await User.deleteMany({});

    const user = new User({
      name: "Test User",
      email: "test2@example.com",
      department: "CSE",
      role: "voter",
      password: "password1234", // Store hashed password

      biometricRegistered: true,
      faceIdKey: "sample-face-id-key", // Replace with actual face ID key
      fingerprintKey: "sample-fingerprint-key", // Replace with actual fingerprint key
    });

    await user.save();
    console.log("✅ Test user created successfully!");
  } catch (error) {
    console.error("❌ Error creating user:", error);
  } finally {
    await mongoose.connection.close();
  }
};

createUser();
