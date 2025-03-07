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
        biometricRegistered: true,
        biometricKeys: [
          {
            credentialId: "admin-cred-1",
            publicKey: "admin-public-key-1",
            deviceId: "admin-device-1",
          },
          {
            credentialId: "admin-cred-2",
            publicKey: "admin-public-key-2",
            deviceId: "admin-device-2",
          },
        ],
      },
      {
        name: "Election Commissioner",
        email: "commissioner@example.com",
        department: "CSE",
        role: "auditor",
        password: await hashPassword("commissionerPass"),
        biometricRegistered: true,
        biometricKeys: [
          {
            credentialId: "commissioner-cred-1",
            publicKey: "commissioner-public-key-1",
            deviceId: "commissioner-device-1",
          },
        ],
      },
      {
        name: "Test Voter 1",
        email: "voter1@example.com",
        department: "CSE",
        role: "voter",
        password: await hashPassword("voterPass1"),
        biometricRegistered: true,
        biometricKeys: [
          {
            credentialId: "voter1-cred-1",
            publicKey: "voter1-public-key-1",
            deviceId: "voter1-device-1",
          },
        ],
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
        biometricRegistered: true,
        biometricKeys: [
          {
            credentialId: "voter3-cred-1",
            publicKey: "voter3-public-key-1",
            deviceId: "voter3-device-1",
          },
          {
            credentialId: "voter3-cred-2",
            publicKey: "voter3-public-key-2",
            deviceId: "voter3-device-2",
          },
        ],
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
