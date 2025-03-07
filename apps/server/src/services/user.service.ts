import User from "../models/user.model";
import { UserType } from "../types/User";
import { generateChallenge, verifySignature } from "../utils/webauthnUtils";

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

// Generate WebAuthn Challenge for Biometric Authentication
export const generateBiometricChallenge = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const challenge = generateChallenge(); // Generate WebAuthn challenge
  user.biometricChallenge = challenge; // Store challenge temporarily
  await user.save();

  return { challenge };
};

// Register WebAuthn Public Key (Biometric)
export const registerBiometric = async (
  userId: string,
  credentialId: string,
  publicKey: string,
  deviceId: string
) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (!user.biometricKeys) user.biometricKeys = [];

  // Check if the biometric key for the same type and device already exists
  const existingKeyIndex = user.biometricKeys.findIndex(
    (key) => key.credentialId === credentialId
  );

  if (existingKeyIndex !== -1) {
    user.biometricKeys[existingKeyIndex].publicKey = publicKey;
  } else {
    user.biometricKeys.push({ credentialId, publicKey, deviceId });
  }

  user.biometricRegistered = user.biometricKeys.length > 0;
  await user.save();
};

// Verify WebAuthn Biometric Authentication
export const verifyBiometricAuth = async (
  userId: string,
  credentialId: string,
  signedChallenge: string
) => {
  const user = await User.findById(userId);
  if (!user || !user.biometricRegistered)
    throw new Error("Biometric authentication not set up");

  const storedCredential = user.biometricKeys.find(
    (key) => key.credentialId === credentialId
  );

  if (!storedCredential) throw new Error("Credential not found");

  // Ensure biometricChallenge is available
  if (!user.biometricChallenge)
    throw new Error("No biometric challenge available for verification");

  // Verify the signed challenge
  const isValid = await verifySignature(
    storedCredential.publicKey,
    user.biometricChallenge, // Now we are sure it's not undefined
    signedChallenge
  );

  if (!isValid) throw new Error("Invalid biometric authentication");

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
  };
};
