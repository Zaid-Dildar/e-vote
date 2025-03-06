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
    biometricRegistered: false, // Ensure new users have no biometrics initially
    biometricKey: null,
  });
  return await user.save();
};

// Update user
export const updateUser = async (
  id: string,
  userData: Partial<UserType>
): Promise<UserType | null> => {
  return await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  });
};

// Delete user
export const deleteUser = async (id: string): Promise<UserType | null> => {
  return await User.findByIdAndDelete(id);
};

// Register biometric data
export const registerBiometric = async (
  id: string,
  biometricKey: string
): Promise<UserType | null> => {
  return await User.findByIdAndUpdate(
    id,
    { biometricRegistered: true, biometricKey },
    { new: true, runValidators: true }
  );
};

// Verify biometric authentication
export const verifyBiometric = async (
  id: string,
  providedBiometricKey: string
): Promise<boolean> => {
  const user = await User.findById(id);
  if (!user || !user.biometricRegistered || !user.biometricKey) return false;

  return user.biometricKey === providedBiometricKey;
};
