import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { UserType } from "../types/User";
import generateToken from "../utils/generateToken";
import { generateChallenge, verifySignature } from "../utils/webauthnUtils";

// Standard Login (Email & Password)
export const authenticateUser = async (email: string, password: string) => {
  const user: UserType | null = await User.findOne({ email });

  if (!user) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid email or password");

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    biometricRegistered: user.biometricRegistered,
    token: generateToken(user._id),
  };
};

// Generate a WebAuthn Challenge for Biometric Authentication
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

  // Check if the biometric key for the same credential already exists
  const existingKeyIndex = user.biometricKeys.findIndex(
    (key) => key.credentialId === credentialId
  );

  if (existingKeyIndex !== -1) {
    user.biometricKeys[existingKeyIndex].publicKey = publicKey; // Update existing key
  } else {
    user.biometricKeys.push({ credentialId, publicKey, deviceId });
  }

  user.biometricRegistered = user.biometricKeys.length > 0;
  await user.save();

  return { message: "Biometric credentials registered successfully" };
};

// Verify WebAuthn Response (Step 2 of 2FA)
export const verifyBiometricAuth = async (
  userId: string,
  credentialId: string,
  signedChallenge: string
) => {
  const user = await User.findById(userId);
  if (!user || !user.biometricRegistered)
    throw new Error("Biometric authentication not set up");

  if (!user.biometricChallenge)
    throw new Error("No biometric challenge available for verification");

  const storedCredential = user.biometricKeys.find(
    (key) => key.credentialId === credentialId
  );

  if (!storedCredential) throw new Error("Credential not found");

  // Verify the signed challenge
  const isValid = await verifySignature(
    storedCredential.publicKey,
    user.biometricChallenge,
    signedChallenge
  );

  if (!isValid) throw new Error("Invalid biometric authentication");

  // Clear the challenge after successful authentication
  user.biometricChallenge = undefined;
  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    token: generateToken(user._id),
  };
};
