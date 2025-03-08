import User from "../models/user.model";
import { UserType } from "../types/User";

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

// Update user
export const updateUser = async (
  id: string,
  userData: Partial<UserType>
): Promise<UserType | null> => {
  if (userData.email) {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser && existingUser._id.toString() !== id) {
      throw { message: "Email already in use by another user", status: 400 };
    }
  }

  return await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  });
};

// Delete user
export const deleteUser = async (id: string): Promise<UserType | null> => {
  return await User.findByIdAndDelete(id);
};
