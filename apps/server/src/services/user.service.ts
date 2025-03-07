import User from "../models/user.model";
import { UserType, BiometricKey } from "../types/User";

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
    biometricKeys: [], // Use an empty array for multiple biometrics
  });
  return await user.save();
};

export const updateUser = async (
  id: string,
  userData: Partial<UserType>
): Promise<UserType | null> => {
  try {
    // If email is being updated, check if it's already taken
    if (userData.email) {
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser && existingUser._id.toString() !== id) {
        throw { message: "Email already in use by another user", status: 400 };
      }
    }

    const updatedUser = await User.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      throw { message: "User not found", status: 404 };
    }

    return updatedUser;
  } catch (error: any) {
    // Handle duplicate key error from MongoDB
    if (error.code === 11000) {
      throw { message: "Email is already in use", status: 400 };
    }

    throw error;
  }
};

// Delete user
export const deleteUser = async (id: string): Promise<UserType | null> => {
  return await User.findByIdAndDelete(id);
};

// Register biometric data (Supports Multiple Biometrics)
export const registerBiometric = async (
  id: string,
  biometricKey: string,
  biometricType: "faceId" | "fingerprint",
  deviceId: string
): Promise<UserType | null> => {
  const user = await User.findById(id);
  if (!user) return null;

  // Check if the device already has a registered key
  const existingIndex = user.biometricKeys.findIndex(
    (key) => key.deviceId === deviceId
  );

  if (existingIndex !== -1) {
    // Update existing biometric key
    user.biometricKeys[existingIndex] = {
      type: biometricType,
      key: biometricKey,
      deviceId,
    };
  } else {
    // Add new biometric key
    user.biometricKeys.push({
      type: biometricType,
      key: biometricKey,
      deviceId,
    });
  }

  user.biometricRegistered = true;
  return await user.save();
};

// Verify biometric authentication
export const verifyBiometric = async (
  id: string,
  providedBiometricKey: string,
  deviceId: string
): Promise<boolean> => {
  const user = await User.findById(id);
  if (!user || !user.biometricRegistered) return false;

  // Find a matching biometric key for the given device
  const matchingBiometric = user.biometricKeys.find(
    (key) => key.deviceId === deviceId && key.key === providedBiometricKey
  );

  return !!matchingBiometric;
};
