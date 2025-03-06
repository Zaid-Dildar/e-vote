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

    // Hash the password before saving

    const user = new User({
      name: "Test User",
      email: "test2@example.com",
      department: "CSE",
      role: "voter",
      password: "password1234", // Store hashed password

      biometricRegistered: true, // Corrected field name
      biometricKey: "your-biometric-public-key", // Corrected field name
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
