import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model";

dotenv.config();

const createUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    const user = new User({
      name: "Test User",
      email: "test2@example.com",
      department: "CSE",
      role: "voter",
      password: "password1234", // Will be hashed automatically
    });

    await user.save();
    console.log("Test user created successfully!");
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    mongoose.connection.close();
  }
};

createUser();
