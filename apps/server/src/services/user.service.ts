import User from "../models/user.model";
import { UserType } from "../types/User";
import bcrypt from "bcryptjs";

// Get all users
export const getAllUsers = async (): Promise<UserType[]> => {
  return await User.find();
};

// Get user by ID
export const getUserById = async (id: string): Promise<UserType | null> => {
  return await User.findById(id);
};

// Create user
export const createUser = async (userData: UserType): Promise<UserType> => {
  const user = new User({
    ...userData,
    biometricRegistered: false,
    biometricKeys: [],
  });
  return await user.save();
};

export const updateUser = async (
  id: string,
  userData: Partial<UserType>,
  isSelfUpdate: boolean = false // Flag to indicate if the user is updating themselves
): Promise<UserType | null> => {
  // Check if the email is already in use by another user
  if (userData.email) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser && existingUser._id.toString() !== id) {
      throw { message: "Email already in use by another user", status: 400 };
    }
  }

  // If the user is updating themselves, remove biometric-related fields
  if (isSelfUpdate) {
    const {
      biometricRegistered,
      biometricKey,
      biometricChallenge,
      ...filteredUserData
    } = userData;
    userData = filteredUserData;
  }

  // Check if password is being updated
  if (userData.password) {
    const user = await User.findById(id);
    if (!user) {
      throw { message: "User not found", status: 404 };
    }

    // Compare new password with existing hash
    const isSamePassword = userData.password === user.password;

    if (!isSamePassword) {
      // Hash the new password only if it has changed
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    } else {
      // Keep the existing hashed password if it's the same
      userData.password = user.password;
    }
  }

  // Update the user
  return await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  });
};

// Delete user
export const deleteUser = async (id: string): Promise<UserType | null> => {
  return await User.findByIdAndDelete(id);
};
