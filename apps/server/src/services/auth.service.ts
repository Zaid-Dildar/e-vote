import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { UserType } from "../types/User";
import generateToken from "../utils/generateToken";

// Standard Login
export const authenticateUser = async (email: string, password: string) => {
  const user: UserType | null = await User.findOne({ email });

  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  return {
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    biometricRegistered: user.biometricRegistered,
    token: generateToken(user._id),
  };
};

// Register biometric key (Face ID or Fingerprint)
export const registerBiometric = async (
  userId: string,
  biometricType: "faceId" | "fingerprint",
  biometricKey: string,
  deviceId: string
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Ensure biometricKeys array exists
  if (!user.biometricKeys) user.biometricKeys = [];

  // Check if the biometric key for the same type and device already exists
  const existingKeyIndex = user.biometricKeys.findIndex(
    (key) => key.type === biometricType && key.deviceId === deviceId
  );

  if (existingKeyIndex !== -1) {
    // Update the existing key for the device
    user.biometricKeys[existingKeyIndex].key = biometricKey;
  } else {
    // Add a new biometric key
    user.biometricKeys.push({
      type: biometricType,
      key: biometricKey,
      deviceId,
    });
  }

  // Mark user as biometrically registered
  user.biometricRegistered = user.biometricKeys.length > 0;
  await user.save();
};

// Authenticate using biometric key (Face ID or Fingerprint)
export const authenticateBiometric = async (
  userId: string,
  biometricType: "faceId" | "fingerprint",
  biometricKey: string,
  deviceId: string
) => {
  const user = await User.findById(userId);
  if (!user || !user.biometricRegistered)
    throw new Error("Biometric authentication not set up");

  // Find the biometric key matching the type and device
  const storedKey = user.biometricKeys.find(
    (key) => key.type === biometricType && key.deviceId === deviceId
  );

  if (!storedKey || storedKey.key !== biometricKey)
    throw new Error("Invalid biometric credentials");

  return {
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    token: generateToken(user._id),
  };
};
