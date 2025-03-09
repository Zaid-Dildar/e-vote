import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model";

dotenv.config();

const createUsers = async () => {
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

    // Define test users
    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        department: "CSE",
        role: "admin",
        password: await hashPassword("adminPassword123"),
        biometricRegistered: false,
      },
      {
        name: "Election Commissioner",
        email: "commissioner@example.com",
        department: "CSE",
        role: "auditor",
        password: await hashPassword("commissionerPass"),
        biometricRegistered: false,
      },
      {
        name: "Test Voter 1",
        email: "voter1@example.com",
        department: "CSE",
        role: "voter",
        password: await hashPassword("voterPass1"),
        biometricRegistered: false,
      },
      {
        name: "Test Voter 2",
        email: "voter2@example.com",
        department: "CSE",
        role: "voter",
        password: await hashPassword("voterPass2"),
        biometricRegistered: false, // Ensure consistency
      },
      {
        name: "Test Voter 3",
        email: "voter3@example.com",
        department: "CSE",
        role: "voter",
        password: await hashPassword("voterPass3"),
        biometricRegistered: false,
      },
    ];

    // Insert users into the database
    const createdUsers = await User.insertMany(users);

    console.log("✅ Test users created successfully!");
    console.log(createdUsers); // Log the users to verify insertion
  } catch (error) {
    console.error("❌ Error creating users:", error);
    process.exit(1); // Exit with failure code
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
  }
};

createUsers();
